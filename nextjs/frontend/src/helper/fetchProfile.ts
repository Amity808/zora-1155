import { ProfileResponse } from '../../types';

export const fetchProfileBalances = async (identifier: string, count: number, chainIds: number[]): Promise<ProfileResponse> => {
  try {
    const url = new URL('https://api-sdk.zora.engineering/profileBalances');
    url.searchParams.append('identifier', identifier);
    url.searchParams.append('count', count.toString());
    url.searchParams.append('chainIds', chainIds.join(','));

    // Fetch data from the API
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch profile balances: ${response.statusText}`);
    }

    const data: ProfileResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching profile balances:', error);
    throw error;
  }
};