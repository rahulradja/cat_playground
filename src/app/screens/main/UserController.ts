import { Texture, Sprite } from "pixi.js"

import {
    randomInt,
} from "../../../engine/utils/random";

export enum DIRECTION {
    N,
    E,
    S,
    W,
}

export class User extends Sprite {
    public direction!: DIRECTION;
    public speed!: number;

    private yMin = -400;
    private yMax = 400;
    private xMin = -400;
    private xMax = 400;

    get left() {
        return -this.width * 0.5;
    }

    get right() {
        return this.width * 0.5;
    }

    get top() {
        return -this.height * 0.5;
    }

    get bottom() {
        return this.height * 0.5;
    }

    private _isWalking: boolean = false
    public get isWalking(): boolean { return this._isWalking }
    public set isWalking(val)
    {
        const shouldStartWalking = this._isWalking === false && val === true
        this._isWalking = val;
        if (shouldStartWalking) { this.startWalking() }
    }
    private _currentFrame: number = 0

        
    constructor(protected _settings: CatSettings) {
        super({ texture: Texture.from(_settings.sitting), anchor: 0.5, scale: _settings.scale });
        this.direction = randomInt(0, 3);
        this.speed = this._settings.walkingSpeed
        window.addEventListener("keydown", (e) => {
            this.isWalking = true
            switch (e.key) {
            case "ArrowUp":
                this.direction = DIRECTION.N;
                break;
            case "ArrowDown":
                this.direction = DIRECTION.S;
                break;
            case "ArrowLeft":
                this.direction = DIRECTION.W;
                break;
            case "ArrowRight":
                this.direction = DIRECTION.E;
                break;
            }
            console.log(DIRECTION[this.direction]);
        });
        window.addEventListener("keyup", (e) => {
            switch (e.key) {
            case "ArrowUp":
            case "ArrowDown":
            case "ArrowLeft":
            case "ArrowRight":
                this.isWalking = false;
            }
            console.log(DIRECTION[this.direction]);
        });
    }
    
    public async startWalking()
    {
        while (this.isWalking)
        {
            this._currentFrame = (this._currentFrame + 1) % this._settings.walkingFrames.length;
            this.texture  = Texture.from(this._settings.walkingFrames[this._currentFrame]);
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }


    public update(): void {
        this.setDirection();
    }

    public resize(w: number, h: number): void {
        this.xMin = -w / 2;
        this.xMax = w / 2;
        this.yMin = -h / 2;
        this.yMax = h / 2;
    }

    private setDirection(): void {
        if (!this._isWalking) { return; }
        switch (this.direction) {
        case DIRECTION.N:
            if (this.position.y + this.top >= this.yMin) {
                this.y -= this.speed;
            }
            break;
        case DIRECTION.E:
            this.scale.x = -this._settings.scale;
            if (this.position.x + this.right <= this.xMax) {
                this.x += this.speed;
            }
            break;
        case DIRECTION.S:
            if (this.position.y + this.bottom <= this.yMax) {
                this.y += this.speed;
            }
            break;
        case DIRECTION.W:
            this.scale.x = this._settings.scale;
            if (this.position.x + this.left >= this.xMin) {
                this.x -= this.speed;
            }
            break;
        }
    }
}

export interface CatSettings
{
    walkingFrames: string[];
    sitting: string,
    walkingSpeed: number;
    scale: number
}
