import { createClient } from 'redis';

// Initialize Redis client
const client = createClient({
    password: 'HAno0JojYwVylERd5ujqSxcsCtEm6p3e',
    socket: {
        host: 'redis-13374.c244.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 13374
    }
});

client.connect();

// Constants for default spins
const MEMBER_DEFAULT_SPINS = 50;
const NON_MEMBER_DEFAULT_SPINS = 20;
const DAILY_SPINS = 10;

// Initialize a new user with spins based on whether they are a member
async function initializeNewUser(userId: string, isPaidMember: boolean, points? : number) {
    const spins = isPaidMember ? MEMBER_DEFAULT_SPINS : NON_MEMBER_DEFAULT_SPINS;
    const userPoints = points !== undefined ? points : 0; // Set points to 0 if not provided

    await client.set(`player:${userId}:spins`, spins.toString());
    await client.set(`player:${userId}:coins`, '0');
    await client.set(`player:${userId}:points`, userPoints.toString());
    await client.set(`player:${userId}:missionIndex`, '0');
    await client.set(`player:${userId}:isPaidMember`, isPaidMember.toString());
    await client.set(`player:${userId}:lastDailySpin`, '0');  // Initialize last daily spin to 0
    console.log(`User ${userId} initialized with ${spins} spins and ${userPoints} points.`);
}

// Get current spins for a user
async function getUserSpins(userId: string): Promise<number> {
    const spins = await client.get(`player:${userId}:spins`);
    return spins ? parseInt(spins, 10) : 0;
}

// Get current coins for a user
async function getUserCoins(userId: string): Promise<number> {
    const coins = await client.get(`player:${userId}:coins`);
    return coins ? parseInt(coins, 10) : 0;
}

// Get current points for a user
async function getUserPoints(userId: string): Promise<number> {
    const points = await client.get(`player:${userId}:points`);
    return points ? parseInt(points, 10) : 0;
}

// Get mission index for a user
async function getMissionIndex(userId: string): Promise<number> {
    const index = await client.get(`player:${userId}:missionIndex`);
    return index ? parseInt(index, 10) : 0;
}

// Update spins for a user
async function updateUserSpins(userId: string, updateVal: number) {
    const currentSpins = await getUserSpins(userId);
    const spins = currentSpins + updateVal;
    await client.set(`player:${userId}:spins`, spins.toString());
    console.log(`User ${userId}'s spins updated to ${spins}.`);
}

// Update coins for a user
async function updateUserCoins(userId: string, updateVal: number) {
    const currentCoins = await getUserCoins(userId);
    const coins = currentCoins + updateVal;
    await client.set(`player:${userId}:coins`, coins.toString());
    console.log(`User ${userId}'s coins updated to ${coins}.`);
}

// Update points for a user
async function updateUserPoints(userId: string, updateVal: number) {
    const currentPoints = await getUserPoints(userId);
    const points = currentPoints + updateVal;
    await client.set(`player:${userId}:points`, points.toString());
    console.log(`User ${userId}'s points updated to ${points}.`);
}

// Grant daily spins if more than 24 hours have passed since the last daily spin
async function grantDailySpins(userId: string) {
    const lastGranted = await client.get(`player:${userId}:lastDailySpin`);
    const now = Date.now();

    // If lastGranted is '0' or more than 24 hours have passed, grant daily spins
    if (!lastGranted || now - parseInt(lastGranted, 10) >= 24 * 60 * 60 * 1000) {
        const currentSpins = await getUserSpins(userId);
        const newSpins = currentSpins + DAILY_SPINS;

        await client.set(`player:${userId}:spins`, newSpins.toString());
        await client.set(`player:${userId}:lastDailySpin`, now.toString());

        console.log(`Granted ${DAILY_SPINS} daily spins to user ${userId}.`);
    } else {
        console.log(`User ${userId} has already received their daily spins.`);
    }
}

export {
    initializeNewUser,
    getUserSpins,
    getUserCoins,
    getUserPoints,
    updateUserSpins,
    updateUserCoins,
    updateUserPoints,
    grantDailySpins
};