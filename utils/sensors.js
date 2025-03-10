export function isWallInFrontSensor(enemy, platforms) {
    const boundingBox = enemy.getBoundingBox();
    const wallSensorX = (enemy.facingDirection === "right") ? boundingBox.right + 10 : boundingBox.left - 10;
    const wallSensorY = boundingBox.top + boundingBox.height / 2;

    let result = enemy.getPlatformAt(wallSensorX, wallSensorY, platforms);

    if (enemy.debugMode && result !== null) {
        console.log("isWallInFrontSensor - detected wall ahead.");
    }

    return result;
}

export function isFloorMissingAheadSensor(enemy, platforms) {
    const boundingBox = enemy.getBoundingBox();
    const floorSensorX = (enemy.facingDirection === "right") ? boundingBox.right + 30 : boundingBox.left - 30;
    const floorSensorY = boundingBox.top + boundingBox.height + 1;

    let result = enemy.getPlatformAt(floorSensorX, floorSensorY, platforms);

    if (enemy.debugMode && result === null) {
        console.log("isFloorMissingAheadSensor - detected missing floor ahead.");
    }

    return (result === null);
}

export function isOnSolidGroundSensor(enemy, platforms) {
    const boundingBox = enemy.getBoundingBox();
    const groundSensorX = (enemy.facingDirection === "right") ? boundingBox.right - boundingBox.width / 2 : boundingBox.left + boundingBox.width / 2;
    const groundSensorY = boundingBox.bottom;

    let result = enemy.getPlatformAt(groundSensorX, groundSensorY, platforms);

    if (enemy.debugMode && result === null) {
        console.log("isOnSolidGroundSensor - detected no ground below.");
    }

    return result !== null;
}
/**
 * Checks if the player is within the enemy's line of sight.
 * @param {*} player
 * @param {*} seeDistance
 * @returns
 */
export function canSeePlayerSensor(enemy, player, seeDistance) {
    const boundingBox = enemy.getBoundingBox();
    const boxX = enemy.facingDirection === 'right'
        ? boundingBox.right
        : boundingBox.left - seeDistance;
    const boxY = boundingBox.top;
    const boxWidth = seeDistance;
    const boxHeight = boundingBox.bottom - boundingBox.top;

    const adjustedBoxX = boxX - enemy.camera.x;
    const adjustedBoxY = boxY - enemy.camera.y;
    const adjustedPlayerX = player.x - enemy.camera.x;
    const adjustedPlayerY = player.y - enemy.camera.y;

    const playerInRange = adjustedPlayerX + player.width > adjustedBoxX && adjustedPlayerX < adjustedBoxX + boxWidth;
    const playerYInRange = adjustedPlayerY > adjustedBoxY && adjustedPlayerY < adjustedBoxY + boxHeight;
    const canSeePlayerSensor = playerInRange && playerYInRange;

    return canSeePlayerSensor;
}