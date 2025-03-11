import FSM from '../libs/FSM.js';
import Projectile from './Projectile.js';
import drawDebugBox from '../utils/debugUtils.js';
import { isWallInFrontSensor, isFloorMissingAheadSensor, isOnSolidGroundSensor, canSeePlayerSensor } from '../utils/sensors.js';

export default class AnimatedEnemy {
    constructor(x, y, onFireProjectile, animationDataUrl) {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.width = null;
        this.height = null;
        this.idleTime = 0;
        this.facingDirection = "right";
        this.startFacingDirection = this.facingDirection;
        this.speed = 1; // speed
        this.startSpeed = 1;
        this.aggroSpeed = 1;
        this.chaseRange = 250; // Range within which the Hunter chases the player
        this.pauseTimeout = null; // Store the timeout ID for pausing patrol
        this.justRespawned = false; // Flag to indicate if the enemy has just respawned
        this.projectiles = []; // Array to store active projectiles
        this.onFireProjectile = onFireProjectile; // Callback function for handling projectile firing events
        this.projectileImage = null; // Image for the projectile
        this.projectileYOffset = null; // Offset for the projectile's y position
        this.projectileSpeed = null; // Speed of the projectile pixel per second
        this.projectileReloadTime = null; // Time between projectile fires
        this.canAttack = true; // Flag to indicate if the enemy has canAttack
        this.useProjectile = false; // Flag to indicate if the enemy uses projectiles
        this.seeDistance = 1; // Distance at which the enemy can see the player
        this.projectileBoundingBox = null;
        this.animationDataUrl = animationDataUrl; // URL for animation data
        this.debugMode = false; // see visuals for sensors and seeing distance
        this.floorSensorXOffset = 0; // Offset for the bottom platform sensor's x position
        this.floorSensorYOffset = 0; // Offset for the bottom platform sensor's y position
        this.aggroSound = null; // Sound to play when the enemy is aggroed

        // Load animation data
        this.animations = {};
        this.loadAnimations();

        // Set the initial animationSet and frame
        this.animationSet = null;
        this.frameIndex = 0;
        this.tickCount = 0;
        this.ticksPerFrame = 10; // Adjust this value to control the animation speed
        this.image = null;
        this.boundingBox = null;
        this.camera = { x: 0, y: 0, width: 800, height: 400 };// need to update this to pass into the constructor

        this.fsm = null;
        this.fsmStartState = null;
        this.fsmStartEvent = null;
    }

    setupFSM() {

        this.fsm.addTransition('idle', 'idle_right', 'idle', () => this.playAnimationSet('idle_right'));
        this.fsm.addTransition('idle', 'idle_left', 'idle', () => this.playAnimationSet('idle_left'));
        this.fsm.addTransition('idle', 'walk_right', 'walk', () => this.playAnimationSet('walk_right'));
        this.fsm.addTransition('idle', 'walk_left', 'walk', () => this.playAnimationSet('walk_left'));

        this.fsm.addTransition('walk', 'idle_right', 'idle', () => this.playAnimationSet('idle_right'));
        this.fsm.addTransition('walk', 'idle_left', 'idle', () => this.playAnimationSet('idle_left'));
        this.fsm.addTransition('walk', 'walk_right', 'walk', () => this.playAnimationSet('walk_right'));
        this.fsm.addTransition('walk', 'walk_left', 'walk', () => this.playAnimationSet('walk_left'));
        this.fsm.addTransition('walk', 'attack_right', 'attack', () => this.playAnimationSet('attack_right'));
        this.fsm.addTransition('walk', 'attack_left', 'attack', () => this.playAnimationSet('attack_left'));

        this.fsm.addTransition('attack', 'attack_right', 'attack', () => this.playAnimationSet('attack_right'));
        this.fsm.addTransition('attack', 'attack_left', 'attack', () => this.playAnimationSet('attack_left'));
        this.fsm.addTransition('attack', 'walk_right', 'walk', () => this.playAnimationSet('walk_right'));
        this.fsm.addTransition('attack', 'walk_left', 'walk', () => this.playAnimationSet('walk_left'));
        this.fsm.addTransition('attack', 'idle_right', 'idle', () => this.playAnimationSet('idle_right'));
        this.fsm.addTransition('attack', 'idle_left', 'idle', () => this.playAnimationSet('idle_left'));


    }

    async loadAnimations() {
        try {
            const response = await fetch(this.animationDataUrl);
            const data = await response.json();
            data.sequences.forEach(sequence => {
                this.animations[sequence.sequence] = sequence.frames.map(frame => ({
                    image: this.loadImage(frame.src),
                    boundingBox: frame.boundingBox
                }));
            });

            // Load the projectile image
            this.projectileImage = this.loadImage(data.projectileImage);
            this.name = data.name;
            this.fsmStartState = data.fsmStartState;
            this.fsmStartEvent = data.fsmStartEvent;
            if (this.fsmStartEvent.includes("right")) {
                this.facingDirection = 'right';
            }
            if (this.fsmStartEvent.includes("left")) {
                this.facingDirection = 'left';
            }
            this.startFacingDirection = this.facingDirection;

            this.width = data.width;
            this.height = data.height;
            this.speed = data.speed;
            this.startSpeed = data.speed;
            this.aggroSpeed = data.aggroSpeed;
            this.idleTime = data.idleTime;
            this.projectileYOffset = data.projectileYOffset;
            this.projectileSpeed = data.projectileSpeed;
            this.projectileReloadTime = data.projectileReloadTime;
            this.useProjectile = data.useProjectile;
            this.seeDistance = data.seeDistance;
            this.projectileBoundingBox = data.projectileBoundingBox;
            this.floorSensorXOffset = data.floorSensorXOffset || 0;
            this.floorSensorYOffset = data.floorSensorYOffset || 0;
            this.wallSensorXOffset = data.wallSensorXOffset || 0;
            this.wallSensorYOffset = data.wallSensorYOffset || 0;
            this.aggroSound = new Audio(data.aggroSound);

            // Initialize the FSM
            this.initFSM();

        } catch (error) {
            console.error('Failed to load animation data:', error);
        }
    }

    initFSM() {
        this.fsm = new FSM(this.fsmStartState);
        this.setupFSM();
        this.fsm.handleEvent(this.fsmStartEvent);
    }

    loadImage(src) {
        const img = new Image();
        if (src === "") {
            console.log("Image source is empty");
            return img;
        }
        img.src = src;
        img.onerror = () => {
            throw new Error(`Failed to load image: ${src}`);
        };
        return img;
    }

    playAnimationSet(newAnimationSet) {
        if (this.debugMode) console.log(`playAnimationSet ${newAnimationSet}`);

        if (this.animations[newAnimationSet]) {
            this.animationSet = newAnimationSet;
            this.frameIndex = 0;
            if (this.animations[this.animationSet][0]) {
                this.image = this.animations[this.animationSet][this.frameIndex].image;
                this.boundingBox = this.animations[this.animationSet][this.frameIndex].boundingBox;
            } else {
                console.error('Failed to play animation sequence: Invalid frames');
            }
        } else {
            console.error('Failed to find animation sequence: ' + newAnimationSet);
        }
    }

    respawn() {
        if (this.debugMode) console.log("Respawning enemy");
        this.x = this.startX;
        this.y = this.startY;
        this.facingDirection = this.startFacingDirection;
        this.fsm.handleEvent(this.fsmStartEvent);
        this.pauseTimeout = null;
        this.frameIndex = 0;
        this.tickCount = 0;
        this.speed = this.startSpeed;
        this.canAttack = true;

        // Clear any pending pause timeout
        if (this.pauseTimeout) {
            clearTimeout(this.pauseTimeout);
            this.pauseTimeout = null;
        }

        this.justRespawned = true; // Set the justRespawned flag

        // Reset the justRespawned flag after a short delay
        setTimeout(() => {
            this.justRespawned = false;
        }, 1000); // Adjust the delay as needed
    }

    draw(ctx, camera) {
        if (this.image && this.image.complete && this.image.naturalWidth !== 0) {
            ctx.drawImage(this.image, this.x - camera.x, this.y - camera.y, this.width, this.height); // Offset by camera's x and y
        }

        // Draw debug box if debug mode is enabled
        if (this.debugMode) {
            const boundingBox = this.getBoundingBox();
            drawDebugBox(ctx, camera, boundingBox, this.facingDirection, this.seeDistance, this.fsm.getState(), this.name);
        }
    }

    checkCollision(player) {
        const boundingBox = this.getBoundingBox();
        return player.x + player.width > boundingBox.left &&
            player.x < boundingBox.right &&
            player.y + player.height > boundingBox.top &&
            player.y < boundingBox.bottom;
    }

    getBoundingBox() {
        if (!this.boundingBox) {
            return { left: this.x, right: this.x + this.width, top: this.y, bottom: this.y + this.height };
        }
        const { left, right, top, bottom } = this.boundingBox;
        return {
            left: this.x + left,
            right: this.x + right,
            top: this.y + top,
            bottom: this.y + bottom,
            width: right - left,
            height: bottom - top
        };
    }

    getPlatformAt(x, y, platforms) {
        for (let i = 0; i < platforms.length; i++) {
            const plat = platforms[i];
            if (
                x >= plat.x &&
                x < plat.x + plat.width &&
                y >= plat.y &&
                y < plat.y + plat.height
            ) {
                return plat;
            }
        }
        return null;
    }

    /**
     * Returns the opposite direction of the current facing direction.
     * @returns {string} The opposite direction ('left' or 'right').
     */
    getAboutFace() {
        return this.facingDirection === 'right' ? 'left' : 'right';
    }

    doAboutFace() {
        this.facingDirection = this.getAboutFace();
        this.x = this.facingDirection === "right" ? this.x + 40 : this.x - 40;
        return this.facingDirection;
    }

    handleState(player, platforms) {
        switch (this.fsm.getState()) {
            case 'idle':
                if (!this.idleStartTime) {
                    this.idleStartTime = Date.now(); // Record the start time of the idle state
                }

                const idleDuration = (Date.now() - this.idleStartTime) / 1000; // Calculate the idle duration in seconds

                if (idleDuration > 10) {
                    // Perform a action if idle for more than 10 seconds
                    if (this.debugMode) console.log('Idle duration exceeded 10 seconds');
                    this.fsm.handleEvent('walk_' + this.doAboutFace());
                }
                break;
            case 'walk':
                this.speed = this.startSpeed;
                this.idleStartTime = null; // Reset the idle start time

                this.moveForward();

                if (isWallInFrontSensor(this, platforms) || isFloorMissingAheadSensor(this, platforms)) {
                    this.fsm.handleEvent('walk_' + this.doAboutFace());
                }

                if (canSeePlayerSensor(this, player, this.seeDistance)) {
                    this.fsm.handleEvent('attack_' + this.facingDirection);
                    if (this.useProjectile) {
                        this.fireProjectile();
                    }
                    if (this.aggroSound) {
                        this.aggroSound.volume = 0.5;
                        this.aggroSound.play();
                    } else {
                        this.aggroSound.pause();
                    }
                }
                break;
            case 'attack':
                this.idleStartTime = null;
                this.speed = this.aggroSpeed;
                this.moveForward();

                if (canSeePlayerSensor(this, player, this.seeDistance) && isWallInFrontSensor(this, platforms)) {
                    this.fsm.handleEvent('idle_' + this.facingDirection);
                    break;
                }

                if (isWallInFrontSensor(this, platforms) || isFloorMissingAheadSensor(this, platforms)) {
                    this.fsm.handleEvent('walk_' + this.doAboutFace());
                }

                if (!canSeePlayerSensor(this, player, this.seeDistance)) {
                    this.fsm.handleEvent('walk_' + this.facingDirection);
                }

                break;
            default:
                break;
        }
    }

    update(player, platforms) {
        if (!this.fsm || !this.seeDistance) {
            return;
        }

        if (!isOnSolidGroundSensor(this, platforms)) {
            this.y += 1;
            return;
        }

        this.handleState(player, platforms);

        // Ensure animations are loaded before updating the frame
        if (!this.animations[this.animationSet]) {
            return;
        }

        // Update the animation frame
        this.tickCount++;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            this.frameIndex = (this.frameIndex + 1) % this.animations[this.animationSet].length;
            if (this.animations[this.animationSet][this.frameIndex]) {
                this.image = this.animations[this.animationSet][this.frameIndex].image;
                this.boundingBox = this.animations[this.animationSet][this.frameIndex].boundingBox;
                //console.log("this.image.src", this.image.src);
            } else {
                console.error('Failed to update frame: Invalid frame index');
            }
        }

    }

    fireProjectile() {
        // Calculate the projectile's starting x position based on the patrol direction and bounding box
        const boundingBox = this.getBoundingBox();
        const projectileXOffset = (this.facingDirection === "right") ? boundingBox.right : boundingBox.left - this.projectileImage.width;
        const projectileYPosition = boundingBox.top + (boundingBox.bottom - boundingBox.top) / 2 - this.projectileYOffset;

        // Create a new projectile and add it to the projectiles array
        const projectile = new Projectile(projectileXOffset - this.camera.x, projectileYPosition - this.camera.y, this.facingDirection, this.projectileSpeed, 500, this.projectileImage, this.projectileBoundingBox);
        this.projectiles.push(projectile);

        // Notify the higher-level component or manager about the projectile firing event
        if (this.onFireProjectile) {
            this.onFireProjectile(projectile);
        }
    }

    moveForward() {
        this.x += (this.facingDirection === "right") ? this.speed : -this.speed;
    }

}