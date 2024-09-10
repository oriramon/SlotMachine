import { initializeNewUser, getUserSpins, clearCurrentDatabase} from './userService';
import { spin } from './slotMachineService';
import readline from 'readline';

// Create a readline interface for terminal interaction
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Helper function to ask a question in the terminal
const askQuestion = (query: string): Promise<string> => {
    return new Promise(resolve => rl.question(query, resolve));
};

// Main function for interactivity
async function startGame() {
    // Ask for username
    let userId = await askQuestion('What is your username? ');

    // Check if the username already exists (we assume exists if they have any spins)
    const spins = await getUserSpins(userId);
    if (spins > 0) {
        console.log('This username already exists. Please choose another.');
        userId = await askQuestion('Enter a different username: ');
    }

    // Ask if the user wants to become a member
    const isMemberInput = await askQuestion('Do you want to become a member? (yes/no) ');
    const isPaidMember = isMemberInput.trim().toLowerCase() === 'yes';

    // Initialize new user
    await initializeNewUser(userId, isPaidMember);

    // Main loop for spinning or ending the game
    let playAgain = true;
    while (playAgain) {
        const action = await askQuestion('Do you want to spin or end the game? (spin/end) ');
        if (action.trim().toLowerCase() === 'spin') {
            await spin(userId); // Process the spin for the user
            if (await getUserSpins(userId) === 0) {
                console.log('You have no spins left! Game over.');
                playAgain = false;
            }
        } else if (action.trim().toLowerCase() === 'end') {
            playAgain = false;
            console.log('Thanks for playing!');
        } else {
            console.log('Invalid option. Please type "spin" or "end".');
        }
    }

    // Close the readline interface when done
    await clearCurrentDatabase(); // Optional
    rl.close();
}

// Start the game
startGame();