import { createClient } from 'redis';
import * as dotenv from 'dotenv';
import { checkMissions } from './missionService';

// Load environment variables from .env file
dotenv.config();

// Initialize Redis client 
// IMPORTANT: make sure to add a .env file with your REDIS_HOST, REDIS_PORT, and REDIS_PASSWORD
const client = createClient({
    password: process.env.REDIS_PASSWORD as string,
    socket: {
        host: process.env.REDIS_HOST as string,
        port: parseInt(process.env.REDIS_PORT as string, 10)
    }
});

client.connect();

// Constants for default spins and points, can change these values
const MEMBER_DEFAULT_SPINS = 50;
const NON_MEMBER_DEFAULT_SPINS = 1;
const DEFAULT_POINTS = 100;

// Initialize a new user with spins based on whether they are a member
async function initializeNewUser(userId: string, isPaidMember: boolean, points? : number) {
    const spins = isPaidMember ? MEMBER_DEFAULT_SPINS : NON_MEMBER_DEFAULT_SPINS;
    const userPoints = points !== undefined ? points : DEFAULT_POINTS;

    await client.set(`player:${userId}:spins`, spins.toString());
    await client.set(`player:${userId}:coins`, '0');
    await client.set(`player:${userId}:points`, userPoints.toString());
    await client.set(`player:${userId}:missionIndex`, '1');
    await client.set(`player:${userId}:isPaidMember`, isPaidMember.toString());
    console.log(`User ${userId} initialized with ${spins} spins and ${userPoints} points.`);

    // Give user their starting rewards
    await checkMissions(userId);
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

// Update mission index for a user
async function updateMissionIndex(userId: string, maxIndex: number, repeatedIndex: number) {
    const currentIndex = await getMissionIndex(userId);
    const index = currentIndex < maxIndex ? currentIndex + 1 : repeatedIndex;
    await client.set(`player:${userId}:missionIndex`, index.toString());
    console.log(`User ${userId}'s mission index updated to ${index}.`);
}

// Clear the current Redis database
async function clearCurrentDatabase() {
    try {
        await client.flushDb();
        console.log('Current Redis database cleared.');
    } catch (error) {
        console.error('Error clearing the database:', error);
    } finally {
        client.disconnect();
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
    updateMissionIndex,
    getMissionIndex,
    clearCurrentDatabase
};