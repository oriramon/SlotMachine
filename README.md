# Slot Machine

## Description
This is an interactive Slot Machine game built  with TypeScript, that uses Redis as the backend for storing player data using microservices architecture.

## Key Features
- Interactive command line interface
- Player can choose to become members, affecting their starting spin count.
- To add interest I manipulated the likely of getting 3 in a row to roughly 10%. This can be removed or changed.
- Redis is used to store player information including spins, coins, points, mission index, and member status
- Completed missions provide additional spins and/or coins as rewards
- The game runs until a player runs out of spins or decideds to stop

## Installation and starting steps

1. Clone the repository: 
    git clone https://github.com/oriramon/SlotMachine.git

2. navigate to project directory

3. Instal dependencies
    - npm install

4. Set up your environment variables. IMPORTANT so that Redis works. If instead you prefer to have access to my Redis host, contact me.
    
    - touch .env
        - REDIS_HOST = your redis host
        - REDIS_PORT = your redis port
        - REDIS_PASSWORD = your redis password

5. Compile the TypeScript code:
    - npx tsc

6. Start the game:
    - node dist/interactiveGame.js

7. Goals and rewards are configurable through the mission.json file



For any further questions please contact me: oriramon@gmail.com