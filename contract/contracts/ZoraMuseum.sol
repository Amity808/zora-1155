// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Create2} from "@openzeppelin/contracts/utils/Create2.sol";

interface IZoraCreator1155Factory {
    function createContract(
        string calldata newContractURI,
        string calldata name,
        RoyaltyConfiguration memory defaultRoyaltyConfiguration,
        address payable defaultAdmin,
        bytes[] calldata setupActions
    ) external returns (address);
}

interface IZoraCreator1155 {
    function mint(address recipient, uint256 tokenId, uint256 amount, bytes calldata data) external;
    function setURI(uint256 tokenId, string memory tokenURI) external;
}

contract ZoraMuseum is ERC721URIStorage, ReentrancyGuard, AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    bytes32 public constant USER_ROLE = keccak256("USER_ROLE");

    error INVALID_INDEX();
    error settlePayment();
    error Already_Initilized();

    struct RoyaltyConfiguration {
        address payable receiver;
        uint16 royaltyBPS;
    }

    address public token;
    uint256 public totalMuseums;
    uint256 public tokenCounter;
    address public admin;
    address public deployedAddress;
    uint256 public fee;
    bool public isAddressSet;
    
    IZoraCreator1155Factory public zoraFactory;
    IZoraCreator1155 public zoraContract;
    mapping(uint256 => address) public zoraNFTContracts;

    enum ArtifactStatus {
        Active,
        Flagged,
        Archived,
        Deprecated
    }

    struct Artifact {
        string imageURI;
        uint256 ticketPrice;
        uint256 totalRevenue;
        uint256 totalVisitors;
        ArtifactStatus status;
        address owner;
        address zoraNFTContract; // New field for Zora contract address
    }

    mapping(uint256 => Artifact) public artifact;
    mapping(address => bool) public haveAccess;
    mapping(address => mapping(uint256 => bool)) public getAccess;

    event ZoraNFTCreated(uint256 indexed artifactId, address zoraNFTContract);
    event ZoraNFTMinted(uint256 indexed artifactId, address recipient, uint256 amount);

    constructor(
        uint256 _fee,
        address _token,
        address _admin,
        address _zoraFactory
    ) ERC721("Museum", "MHR") {
        _setRoleAdmin(USER_ROLE, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(MANAGER_ROLE, DEFAULT_ADMIN_ROLE);
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(MANAGER_ROLE, _admin);
        tokenCounter = 0;
        totalMuseums = 0;
        token = _token;
        admin = _admin;
        fee = _fee;
        zoraFactory = IZoraCreator1155Factory(_zoraFactory);
    }

    function createArtifactWithZora(
        uint256 _ticketPrice,
        string memory _imageURI,
        string memory _name,
        uint16 _royaltyBPS
    ) public onlyManger {
        // Create Zora NFT contract
        RoyaltyConfiguration memory royaltyConfig = RoyaltyConfiguration({
            receiver: payable(msg.sender),
            royaltyBPS: _royaltyBPS
        });

        bytes[] memory setupActions = new bytes[](0);
        address zoraNFTContract = zoraFactory.createContract(
            _imageURI,
            _name,
            royaltyConfig,
            payable(msg.sender),
            setupActions
        );

        // Create artifact
        artifact[totalMuseums] = Artifact(
            _imageURI,
            _ticketPrice,
            0,
            0,
            ArtifactStatus.Active,
            msg.sender,
            zoraNFTContract
        );

        zoraNFTContracts[totalMuseums] = zoraNFTContract;
        
        _safeMint(msg.sender, tokenCounter);
        _setTokenURI(tokenCounter, _imageURI);
        
        emit ZoraNFTCreated(totalMuseums, zoraNFTContract);
        
        tokenCounter++;
        totalMuseums++;
    }

    function mintZoraNFT(uint256 artifactId, address recipient, uint256 amount) public {
        require(artifact[artifactId].status == ArtifactStatus.Active, "Artifact not active");
        require(getAccess[msg.sender][artifactId], "No access to mint");
        
        address zoraNFTContract = zoraNFTContracts[artifactId];
        require(zoraNFTContract != address(0), "No Zora contract");

        IZoraCreator1155(zoraNFTContract).mint(
            recipient,
            artifactId,
            amount,
            ""
        );

        emit ZoraNFTMinted(artifactId, recipient, amount);
    }

    // ... [Keep existing functions] ...

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}