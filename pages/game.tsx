import Image from 'next/image'
import { Dropdown, Checkbox } from "@nextui-org/react";

export default function Game() {
  return (

    <main className="flex min-h-screen flex-col items-center justify-between p-10">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono lg:flex flex-col">
        <p className="font-mono text-5xl lg:text-2x1 fixed left-0 top-0 flex w-full items-center justify-center border-b border-gray-300 bg-gray-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/60 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/60">
          We picked a game for you!
        </p>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-2/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
        <Image
          src="/game_image.jpeg"
          alt="Steam Logo"
          width={450}
          height={250}
          priority
        />
      </div>
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono lg:flex flex-col">
        <p className="font-mono text-5xl lg:text-2x1 fixed left-0 top-0 flex w-full items-center justify-center border-b border-gray-300 bg-gray-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/60 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/60">
          Game Title
        </p>
      </div>
        <div className="flex items-center justify-between">
        </div>
          <Dropdown>
            <Dropdown.Button flat>Pick me a new game in this genre: </Dropdown.Button>
            <Dropdown.Menu aria-label="Static Actions">
              <Dropdown.Item key="action">Action</Dropdown.Item>
              <Dropdown.Item key="adventure">Adventure</Dropdown.Item>
              <Dropdown.Item key="casual">Casual</Dropdown.Item>
              <Dropdown.Item key="experimental">Experimental</Dropdown.Item>
              <Dropdown.Item key="puzzle">Puzzle</Dropdown.Item>
              <Dropdown.Item key="racing">Racing</Dropdown.Item>
              <Dropdown.Item key="RPG">RPG</Dropdown.Item>
              <Dropdown.Item key="simulation">Simulation</Dropdown.Item>
              <Dropdown.Item key="sports">Sports</Dropdown.Item>
              <Dropdown.Item key="strategy">Strategy</Dropdown.Item>
              <Dropdown.Item key="tabletop">Tabletop</Dropdown.Item>

            </Dropdown.Menu>
          </Dropdown>
          <Checkbox color="gradient" labelColor="primary" defaultSelected>I want to play a game that at least one friend has played.</Checkbox>

    </main>
  );
}


