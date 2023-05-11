import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export interface VanityURLResponse {
  response: {
    steamid: string;
    success: number;
  };
}

export interface OwnedGamesResponse {
  response: {
    game_count: number;
    games: OwnedGame[];
  }
}

export interface OwnedGame {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url: string;
  has_community_visible_stats: boolean;
  playtime_windows_forever: number;
  playtime_mac_forever: number;
  playtime_linux_forever: number;
  rtime_last_played: number;
  content_descriptorids: number[];
}

export interface FriendListResponse {
  friendslist: {
    friends: Friend[];
  }
}

export interface Friend {
  steamid: string;
  relationship: string;
  friend_since: number;
}

export interface OwnershipResponse {
  ownsapp: boolean;
  permanent: boolean;
  timestamp: string;
  ownersteamid: number;
  sitelicense: boolean;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { action, steamId, appId, vanityUrl } = req.query;

  if (action === 'getownedgames') {
    const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=0E00F7EF0B2F059F483C5D2AE58213B6&steamid=${steamId}&include_appinfo=true&format=json`;

    try {
      const response = await fetch(url);
      const data = (await response.json()) as OwnedGamesResponse;
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching owned games' });
    }
  } else if (action === 'resolvevanityurl') {
    const url = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=0E00F7EF0B2F059F483C5D2AE58213B6&vanityurl=${vanityUrl}`;

    try {
      const response = await fetch(url);
      const data = (await response.json()) as VanityURLResponse;
      const steamId = data.response.steamid;
      res.status(200).json({ steamId });
    } catch (error) {
      res.status(500).json({ error: 'Error resolving vanity URL' });
    }
  } else if (action ==='getfriendlist') {
    const url = `https://api.steampowered.com/ISteamUser/GetFriendList/v1/?key=0E00F7EF0B2F059F483C5D2AE58213B6&steamid=${steamId}`;

    try {
      const response = await fetch(url);
      const data = (await response.json()) as FriendListResponse;
      res.status(200).json(data);


    } catch (error) {
      res.status(500).json({ error: 'Error retrieving friend list' });
    }
  } else if (action === 'checkownership') {
    const url = `https://api.steampowered.com/ISteamUser/CheckAppOwnership/v2/?key=0E00F7EF0B2F059F483C5D2AE58213B6&steamid=${steamId}&appid=${appId}`;

    try {
      const response = await fetch(url);
      const data = (await response.json()) as OwnershipResponse;
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error checking app ownership' });
    }
  } 
  //TODO: getuserstats

  //TODO: showrecentlyplayed
  
  else {
    res.status(400).json({ error: 'Invalid action' });
  }
};

export default handler;



