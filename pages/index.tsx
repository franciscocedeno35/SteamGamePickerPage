import { useState } from 'react';
import Image from 'next/image';
import { FriendListResponse, OwnedGame, OwnedGamesResponse, OwnershipResponse } from './api/steam';
import { useRouter } from 'next/router';
import { Checkbox } from '@nextui-org/react';

export default function Home() {
  const [imageUrl, setImageUrl] = useState('');



  const [steamUrl, setSteamUrl] = useState('');

  var doFriendCheck = false;
  var unplayedOnly = true;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSteamUrl(event.target.value);
  };

  const handleFriendChange = (isSelected: boolean) => {
    doFriendCheck = isSelected;
  };

  const handleUnplayedChange = (isSelected: boolean) => {
    unplayedOnly = isSelected;
  };

  const extractSteamId = async (url: string): Promise<string> => {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname === 'steamcommunity.com') {
        if (parsedUrl.pathname.startsWith('/profiles/')) {
          const steamId = parsedUrl.pathname.split('/')[2];
          const steamIdNumber = parseInt(steamId, 10);
          if (!isNaN(steamIdNumber)) {
            return steamId;
          }
        } else if (parsedUrl.pathname.startsWith('/id/')) {
          const vanityUrl = parsedUrl.pathname.split('/')[2];
          const steamId = await resolveVanityUrl(vanityUrl);
          return steamId;
        }
      }
    } catch (error) {
      // Invalid URL
    }
    return '';
  };

  const resolveVanityUrl = async (vanityUrl: string) => {
    const response = await fetch(`/api/steam?action=resolvevanityurl&vanityUrl=${vanityUrl}`);
    const data = await response.json();
    return data.steamId;
  };

  const fetchOwnedGames = async () => {
    //Initialization Section
    const steamId = await extractSteamId(steamUrl); 
    if (!steamId) return;
    const response = await fetch(`/api/steam?action=getownedgames&steamId=${steamId}`);

    const ownedGames = (await response.json()) as OwnedGamesResponse;

    //Picker Section
    var picker = Math.floor(Math.random() * ownedGames.response.game_count);
    var pickedGame: OwnedGame;

    console.debug('Number of games owned by steamID ' + steamId + ': ' + ownedGames.response.game_count);

    //Friendship Checker Section
    //If we want to play something that a friend has played:
    if (doFriendCheck) {
      if (unplayedOnly) {
        while (ownedGames.response.games[picker].playtime_forever > 0) {
          var picker = Math.floor(Math.random() * ownedGames.response.game_count);
        }
      }
      
      pickedGame = ownedGames.response.games[picker];

      const friendsResp = await fetch(`/api/steam?action=getfriendlist&steamId=${steamId}`);
      const friendsList = (await friendsResp.json()) as FriendListResponse;

      for (let i = 0; i < friendsList.friendslist.friends.length; i++) {
        var friend = friendsList.friendslist.friends[i];
        const ownedResp = await fetch(`/api/steam?action=checkownership&steamId=${friend.steamid}&appid=${pickedGame.appid}`);
        const isOwned = (await ownedResp.json()) as OwnershipResponse;
        if (isOwned.ownsapp) break;
      }
    }
    //If we have no friends or don't care
    else {
      if (unplayedOnly) {
        while (ownedGames.response.games[picker].playtime_forever > 0) {
          var picker = Math.floor(Math.random() * ownedGames.response.game_count);
        }
      }
      pickedGame = ownedGames.response.games[picker];
    }

    //Data Showcasing Section
    //get game name and display it
    (document.getElementById('gameImg') as HTMLImageElement).alt = pickedGame.name;
    // setImageUrl(data.imageUrl);

    (document.getElementById('gameName') as HTMLParagraphElement).innerText = pickedGame.name;

    //display app header image, used in store
    const gameImage = "https://steamcdn-a.akamaihd.net/steam/apps/" + pickedGame.appid +"/header.jpg";
    (document.getElementById('gameImg') as HTMLImageElement).src = gameImage;
    setImageUrl(gameImage);

    //link the steam run link to the header image
    const gameUrl = "steam://run/" + pickedGame.appid;
    var a = (document.getElementById('runLink')) as HTMLLinkElement;
    a.setAttribute("href", gameUrl);

    //spit this stuff out to the console, just in case
    console.debug("Chosen game: ");
    console.debug(pickedGame.name);
    console.debug(gameImage);
    console.debug(gameUrl);
  };
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10">
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-2/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
        <Image
          src="/steam.png"
          alt="Steam Logo"
          width={450}
          height={250}
          priority
        />
      </div>

      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono lg:flex flex-col">
        <p id="leadIn" className="font-mono text-5xl lg:text-2x1 fixed left-0 top-0 flex w-full items-center justify-center border-b border-gray-300 bg-gray-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/60 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/60">
          We'll pick a game you haven't played!
        </p>
      </div>

      <div className="relative flex place-items-center">
        <a id="runLink" href=""><Image 
          id="gameImg"
          src={imageUrl}
          alt=""
          width={460}
          height={215} 
        style={{ display: imageUrl ? 'block' : 'none' }}
          priority


        /></a>
      </div>

      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono lg:flex flex-col" style={{ display: imageUrl ? 'block' : 'none' }}>
        <p id="gameName" className="font-mono text-3xl lg:text-2x1 fixed left-0 top-0 flex w-full items-center justify-center border-b border-gray-300 bg-gray-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/60 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/60">
        </p>
      </div>

      <form className="w-128 max-w-3xl mx-auto">
        <div className="mb-4">
          <label className="block font-mono text-3xl text-gray-200 mb-2" htmlFor="user">
            Enter User ID:
          </label>
          <input
            className="appearance-none font-mono italic border rounded w-full py-2 px-3 text-gray-600 leading-tight focus:outline-none focus:shadow-outline"
            id="url"
            type="text"
            placeholder="https://steamcommunity.com/id/"
            value={steamUrl}
            onChange={handleInputChange}
          />
        </div>
        <Checkbox id="friendChoice" className="w-full" color="gradient" onChange={handleFriendChange} label="I want to play something that a friend has played." labelColor="secondary"></Checkbox>
        <Checkbox id="unplayedChoice" className="w-full" color="gradient" onChange={handleUnplayedChange} label="I want to play something that I haven't played yet." labelColor="secondary" defaultSelected></Checkbox>
        <div className="flex items-center justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4 m-4"
            type="button"
            onClick={fetchOwnedGames}
          >
            Search
          </button>
        </div>
      </form>
    </main>
  )
}


