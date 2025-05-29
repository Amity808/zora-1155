export type ProfileResponse = {
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