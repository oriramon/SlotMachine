import { updateUserSpins, getUserSpins, updateUserPoints } from './userService';
import { checkMissions } from './missionService';

// Generate random spin result (three digits)
function generateSpinResult(): number[] {
    // Decide whether to generate identical numbers (10% chance)
    const getLucky = Math.random() < 0.1;

    if (getLucky) { // DEBUG: add " || true" to always get jackpot
        // Generate three identical numbers
        const jackpotNumber = Math.floor(Math.random() * 10);
        return [jackpotNumber, jackpotNumber, jackpotNumber];
    } else {
        // Generate three random numbers (they may or may not be the same)
        return [
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10)
        ];
    }
}

// Check if all three digits are identical
function isJackpot(result: number[]): boolean {
    return result[0] === result[1] && result[1] === result[2];
}

// Process a spin for the user
async function spin(userId: string) {
    // Fetch user's current spins
    const spinsBalance = await getUserSpins(userId);

    if (spinsBalance > 0) {

        // Generate a spin result
        const result = await generateSpinResult();
        console.log(`User ${userId} spun the result:`, result);
        
        // Decrement user's spins
        await updateUserSpins(userId,  -1);

        if (isJackpot(result)) {
            // Jackpot: triple the points
            const points = result[0] * 3;
            console.log(`User ${userId} hit the jackpot and earned ${points} points!`);
            await updateUserPoints(userId, points)
        }

        // Apply rewards from missions
        await checkMissions(userId);
    } else {
        console.log(`User ${userId} has no spins left!`);
    }
}

export {
    spin
}

