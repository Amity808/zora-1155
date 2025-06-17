import React, { useState, useEffect } from 'react';
// import { truncateAddress } from '@/utils/truncateAddress';
import { fetchProfileBalances } from '@/helper/fetchProfile';
import { useAccount, useChainId } from 'wagmi';
import { truncateBalance } from '@/utils/truncateAddress';
// import BuyToken from './BuyModal';
import SellToken from './SellModal';

type ProfileResponse = {
  profile: {
    id: string;
    handle: string;
    avatar: null | {
      small: string;
      medium: string;
      blurhash?: string;
    };
    coinBalances: {
      count: number;
      edges: Array<{
        node: {
          balance: string;
          id: string;
          coin: {
            id: string;
            name: string;
            description: string;
            address: string;
            symbol: string;
            totalSupply: string;
            totalVolume: string;
            volume24h: string;
            createdAt: string;
            creatorAddress: string;
            creatorEarnings: Array<{
              amount: {
                currencyAddress: string;
                amountRaw: string;
                amountDecimal: number;
              };
              amountUsd: string;
            }>;
            marketCap: string;
            marketCapDelta24h: string;
            chainId: number;
            tokenUri: string;
            creatorProfile: {
              id: string;
              handle: string;
              avatar: null | {
                small: string;
                medium: string;
                blurhash?: string;
              };
            };
            mediaContent: {
              mimeType: string;
              originalUri: string;
              previewImage: {
                small: string;
                medium: string;
                blurhash?: string;
              };
            };
            transfers: {
              count: number;
            };
            uniqueHolders: number;
          };
        };
      }>;
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
    };
  };
};



const ProfileCoinBalances: React.FC = () => {
  // const profile = profileData.profile;
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
console.log(error, loading)

  const { address } = useAccount()
  const chainId = useChainId();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const count = 30;
        const data = await fetchProfileBalances(address as `0x${string}`, count, [chainId]);
        setProfileData(data);
        console.log('Fetched Profile Data:', data);
      } catch (err) {
        setError('Failed to fetch profile balances.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [address, chainId]);

  console.log('Profile Data:', profileData);

  if (!profileData) {
    return <div className="text-center text-gray-500">Loading make sure you have minted an artifact or Connect Your Account To View Your Profile.</div>;
  }

  const profile = profileData.profile; 
  const dummyImage = "https://plus.unsplash.com/premium_photo-1723028769916-a767a6b0f719?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZSUyMGljb258ZW58MHx8MHx8fDA%3D";


  return (
    <div className="bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Profile: {profile?.handle}</h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Image Section */}
          <div className="w-full md:w-1/2">
            <img
              src={profile?.avatar?.medium || dummyImage}
              alt={profile?.handle}
              className="rounded-lg shadow-lg w-full"
            />
          </div>

          {/* Profile Details Section */}
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl font-semibold mb-4">{profile?.handle}</h2>

            {/* Coin Balances */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Coin Balances</h3>
              {profile?.coinBalances.edges.map((edge, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-800 rounded-lg">
                  <h4 className="text-lg font-semibold">{edge.node.coin.name}</h4>
                  <p className="text-gray-300">{edge.node.coin.description}</p>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-gray-400">Balance</p>
                      <p className="text-white">{truncateBalance(edge.node.balance)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Symbol</p>
                      <p className="text-white">{edge.node.coin.symbol}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Market Cap</p>
                      <p className="text-white">{edge.node.coin.marketCap}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Total Supply</p>
                      <p className="text-white">{edge.node.coin.totalSupply}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <img
                      src={edge.node.coin.mediaContent.previewImage.medium}
                      alt={edge.node.coin.name}
                      className="rounded-lg shadow-lg w-full"
                    />
                  </div>
                  <div>
                    <SellToken targetAddrress={edge.node.coin.address as `0x${string}`} />

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCoinBalances;