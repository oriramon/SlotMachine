import { spin } from './slotMachineService';
import { initializeNewUser } from './userService';

// Example usage
(async () => {
    const userId = '12345';
    await initializeNewUser(userId, true, 100);
    await spin(userId);  // Process a spin for the user
})();