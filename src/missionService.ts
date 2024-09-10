import { getUserPoints, updateUserSpins, updateUserCoins, updateUserPoints, getMissionIndex, updateMissionIndex } from './userService';
import * as fs from 'fs/promises';
import * as path from 'path';

// Global variables from mission file
let repeatedIndex: number;
let missionCount: number;

// Load the missions configuration from the missions JSON file
async function loadMissionsConfig() {
    const filePath = path.join(__dirname, '../missions.json');
    
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const missionConfig = JSON.parse(data);

        // Set the global variables
        repeatedIndex = missionConfig.repeatedIndex;
        missionCount = missionConfig.missions.length;

        return missionConfig;
    } catch (error) {

        // Handle JSON file errors
        if (error instanceof Error) {
            console.error('Unable to load mission: ', error.message);
        } else {
            console.error('Unable to load mission: An unknown error occurred');
        }
        return null;
    }
}

// Check if the player qualifies for a reward based on points
async function checkMissions(userId: string) {
    
    // Load missions from JSON file
    const missionConfig = await loadMissionsConfig();
    if (!missionConfig) return;

    let currentMissionIndex = await getMissionIndex(userId);
    let mission = missionConfig.missions[currentMissionIndex - 1];
    let currentPoints = await getUserPoints(userId);

    // Loop through missions
    while (currentPoints >= mission.pointsGoal) {
        for (const reward of mission.rewards) {
            if (reward.name === 'spins') {
                // Update user spins
                console.log(`User ${userId} earned ${reward.value} spins.`);
                await updateUserSpins(userId, reward.value);
            }
            if (reward.name === 'coins') {
                // Update user coins
                console.log(`User ${userId} earned ${reward.value} coins.`);
                await updateUserCoins(userId, reward.value);
            }
        }
        console.log(`User ${userId} used ${mission.pointsGoal} points.`);
        // Update user points
        await updateUserPoints(userId, -mission.pointsGoal);
        console.log(`User ${userId} completed a mission and received rewards.`);
        // Update mission index
        await updateMissionIndex(userId, missionCount, repeatedIndex);
        currentMissionIndex = await getMissionIndex(userId);
        mission = missionConfig.missions[currentMissionIndex - 1];
        currentPoints = await getUserPoints(userId);
    }
}

export {
    checkMissions
}