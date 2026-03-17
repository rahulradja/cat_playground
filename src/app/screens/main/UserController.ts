import { Texture, AnimatedSprite, AnimatedSpriteFrames, Container } from "pixi.js"
import { KeyboardInput } from "../../controllers/KeyboardInput";

export class User extends Container {
    public speed!: number;
    private keyboardInput: KeyboardInput;
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
        this._isWalking = val;
        if (!val) { this._walkingSprite.stop() }
        else { this._walkingSprite.play()}
    }

    private _walkingSprite: AnimatedSprite;
    private _sittingTexture: Texture;
    private _sleepingTexture: Texture;

    constructor(protected _settings: CatSettings) {
        super();
        this.speed = this._settings.walkingSpeed
        this.keyboardInput = new KeyboardInput();
        this.keyboardInput.trackKey("ArrowUp");
        this.keyboardInput.trackKey("ArrowDown");
        this.keyboardInput.trackKey("ArrowLeft");
        this.keyboardInput.trackKey("ArrowRight");
        this._walkingSprite = this.createWalkingSprite();
        this._sittingTexture = Texture.from(_settings.sitting);
        this._sleepingTexture = Texture.from(_settings.sleeping)

    }

    public update(): void {
        this.move();
    }

    public resize(w: number, h: number): void {
        this.xMin = -w / 2;
        this.xMax = w / 2;
        this.yMin = -h / 2;
        this.yMax = h / 2;
    }

    private createWalkingSprite(): AnimatedSprite
    {
        const spriteFrame: AnimatedSpriteFrames = this._settings.walkingFrames.map((frame) => Texture.from(frame))
        const walkingSprite = new AnimatedSprite({textures: spriteFrame, animationSpeed: 0.05, loop: true, scale: this._settings.scale});
        walkingSprite.play();
        this.addChild(walkingSprite);
        walkingSprite.position = {x: -walkingSprite.width/2, y: -walkingSprite.height/2}
        return walkingSprite;
    }

    private move(): void {
        this.isWalking = this.keyboardInput.pressedKeys.length > 0
        if (this.keyboardInput.isKeyPressed("ArrowUp") && this.position.y + this.top >= this.yMin) {
            this.y -= this.speed;
        }
        if (this.keyboardInput.isKeyPressed("ArrowRight") && this.position.x + this.right <= this.xMax) {
            this.scale.x = -1;
            this.x += this.speed;
        }
        if (this.keyboardInput.isKeyPressed("ArrowDown") && this.position.y + this.bottom <= this.yMax) {
            this.y += this.speed;
        }

        if (this.keyboardInput.isKeyPressed("ArrowLeft") && this.position.x + this.left >= this.xMin) {
            this.scale.x = 1;
            this.x -= this.speed;
        }
    }
}

export interface CatSettings
{
    walkingFrames: string[];
    sitting: string,
    walkingSpeed: number;
    sleeping: string;
    scale: number
}
