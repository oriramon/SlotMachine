import { getUserPoints, updateUserSpins, updateUserCoins, updateUserPoints } from './userService';
import * as fs from 'fs/promises';
import * as path from 'path';

// Global variables from mission file
let repeatedIndex: number;
let numberOfMissions: number;

// Load the missions configuration from the missions JSON file
async function loadMissionsConfig() {
    const filePath = path.join(__dirname, '../missions.json');
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);

    // Set global variables
}

// Check if the player qualifies for a reward based on points
async function checkMissions(userId: string) {
    
    // Load missions from JSON file
    const missionConfig = await loadMissionsConfig();
    
    for (const mission of missionConfig.missions) {
        const points = await getUserPoints(userId);
        // console.log(`DEBUG: entered mission ${mission.pointsGoal}, user points = ${points}`);

        if (points >= mission.pointsGoal) {
            // console.log(`DEBUG: entered if points >= pointsGoal`); //DEBUG
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
            await updateUserPoints(userId, -mission.pointsGoal);
            console.log(`User ${userId} completed a mission and received rewards.`);
        }
    }
}

export {
    checkMissions
}