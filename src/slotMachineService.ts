// import { createClient } from 'redis';
import { updateUserSpins, getUserSpins, grantDailySpins, updateUserPoints } from './userService';
import { checkMissions } from './missionService';

// // Initialize Redis client
// const client = createClient({
//     password: 'HAno0JojYwVylERd5ujqSxcsCtEm6p3e',
//     socket: {
//         host: 'redis-13374.c244.us-east-1-2.ec2.redns.redis-cloud.com',
//         port: 13374
//     }
// });

// client.connect();

// Generate random spin result (three digits)
function generateSpinResult(): number[] {
    return [
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10)
    ];
}

// Check if all three digits are identical
function isJackpot(result: number[]): boolean {
    return result[0] === result[1] && result[1] === result[2];
}

// Process a spin for the user
async function spin(userId: string) {
    const spinsBalance = await getUserSpins(userId);  // Fetch user's current spins

    if (spinsBalance > 0) {
        // Decrement user's spins
        await updateUserSpins(userId,  -1);
        
        const result = await generateSpinResult();
        console.log(`User ${userId} spun the result:`, result);

        if (isJackpot(result)) {
            const points = result[0] * 3;  // Sum of three identical digits
            console.log(`User ${userId} hit the jackpot and earned ${points} points!`);
            await updateUserPoints(userId, points)
        }
        await checkMissions(userId);
    } else {
        console.log(`User ${userId} has no spins left!`);
    }
}

export {
    spin
}

