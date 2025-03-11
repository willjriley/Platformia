export default function drawDebugBox(ctx, camera, boundingBox, facingDirection, seeDistance, fsmState, name) {
    if (!boundingBox || boundingBox.left === undefined || boundingBox.right === undefined || boundingBox.top === undefined || boundingBox.bottom === undefined) {
        console.error('Invalid boundingBox:', boundingBox);
        return;
    }

    const boxX = facingDirection === 'right'
        ? boundingBox.right
        : boundingBox.left - seeDistance;


    const boxY = boundingBox.top;
    const boxWidth = seeDistance;
    const boxHeight = boundingBox.bottom - boundingBox.top;

    // can see
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX - camera.x, boxY - camera.y, boxWidth, boxHeight);

    // Draw background for the text
    ctx.fillStyle = 'black';
    ctx.fillRect(boxX - camera.x + 5, boxY - camera.y, 95, 15);

    ctx.fillStyle = 'yellow';
    ctx.font = '10px Arial';
    ctx.fillText('canSeePlayerSensor', boxX - camera.x + 5, boxY - camera.y + 10);

    const floorSensorX = (facingDirection === "right") ? boundingBox.right + 1 : boundingBox.left - 1;
    const floorSensorY = boundingBox.top + boundingBox.height + 1;

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(floorSensorX - camera.x, floorSensorY - camera.y);
    ctx.lineTo(floorSensorX - camera.x, floorSensorY - camera.y + 10); // Draw a short line downwards
    ctx.stroke();

    // Draw background for the text
    ctx.fillStyle = 'black';
    ctx.fillRect(floorSensorX - camera.x - 15, floorSensorY - camera.y + 25, 130, 15); // Adjusted width to fit the text
    ctx.fillStyle = 'red';
    ctx.fillText('isFloorMissingAheadSensor', floorSensorX - camera.x - 10, floorSensorY - camera.y + 35); // Adjusted position to fit within the background

    // Draw the sensor for checking if there is a wall ahead
    const wallSensorX = (facingDirection === "right") ? boundingBox.right + 10 : boundingBox.left - 10;
    const wallSensorY = boundingBox.top + boundingBox.height / 2;

    ctx.strokeStyle = '#00BFFF'; // Bright blue color
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(wallSensorX - camera.x, wallSensorY - camera.y);
    ctx.lineTo(wallSensorX - camera.x + 10, wallSensorY - camera.y); // Draw a short line to the right
    ctx.stroke();

    ctx.fillStyle = 'black';
    ctx.fillRect(wallSensorX - camera.x - 5, wallSensorY - camera.y + 12, 100, 10); // Adjusted width to fit the text
    ctx.fillStyle = '#00BFFF';
    ctx.fillText('isWallInFrontSensor', wallSensorX - camera.x, wallSensorY - camera.y + 20);

    // Draw isOnSolidGroundSensor
    const groundSensorX = (facingDirection === "right") ? boundingBox.right - boundingBox.width / 2 : boundingBox.left + boundingBox.width / 2;
    const groundSensorY = boundingBox.bottom;

    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(groundSensorX - camera.x, groundSensorY - camera.y);
    ctx.lineTo(groundSensorX - camera.x, groundSensorY - camera.y + 20); // Draw a short line downwards
    ctx.stroke();

    ctx.fillStyle = 'black';
    ctx.fillRect(groundSensorX - camera.x + 5, groundSensorY - camera.y + 12, 110, 10); // Adjusted width to fit the text
    ctx.fillStyle = 'green';
    ctx.fillText('isOnSolidGroundSensor', groundSensorX - camera.x + 5, groundSensorY - camera.y + 20);

    // Draw the bounding box outline in purple
    ctx.strokeStyle = 'purple';
    ctx.lineWidth = 2;
    ctx.strokeRect(boundingBox.left - camera.x, boundingBox.top - camera.y, boundingBox.right - boundingBox.left, boundingBox.bottom - boundingBox.top);

    // Draw the FSM state label above the bounding box
    ctx.fillStyle = 'black';
    ctx.fillRect(boundingBox.left - camera.x, boundingBox.top - camera.y - 30, boundingBox.width + 2, 15); // Adjusted width to fit the text
    ctx.fillStyle = 'white';
    ctx.fillText(`Name: ${name}`, boundingBox.left - camera.x + 5, boundingBox.top - camera.y - 20);

    ctx.fillStyle = 'purple';
    ctx.fillRect(boundingBox.left - camera.x, boundingBox.top - camera.y - 15, boundingBox.width + 2, 15); // Adjusted width to fit the text
    ctx.fillStyle = 'white';
    ctx.fillText(`FSM State: ${fsmState}`, boundingBox.left - camera.x + 5, boundingBox.top - camera.y - 5);
}