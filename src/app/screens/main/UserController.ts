import { Texture, Sprite } from "pixi.js"
import { KeyboardInput } from "../../controllers/KeyboardInput";

export class User extends Sprite {
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
        const hasChangedValue = this._isWalking !== val
        this._isWalking = val;
        if (!hasChangedValue){ return; }
        if (val) { this.startWalking() }
        else { this.stopWalking() }
    }
    private _currentFrame: number = 0;

        
    constructor(protected _settings: CatSettings) {
        super({ texture: Texture.from(_settings.sitting), anchor: 0.5, scale: _settings.scale });
        this.speed = this._settings.walkingSpeed
        this.keyboardInput = new KeyboardInput();
        this.keyboardInput.trackKey("ArrowUp");
        this.keyboardInput.trackKey("ArrowDown");
        this.keyboardInput.trackKey("ArrowLeft");
        this.keyboardInput.trackKey("ArrowRight");
    }
    
    public async startWalking()
    {
        while (this.isWalking)
        {
            this._currentFrame = (this._currentFrame + 1) % this._settings.walkingFrames.length;
            this.setTexture(this._settings.walkingFrames[this._currentFrame]);
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    public async stopWalking()
    {
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.texture  = Texture.from(this._settings.sitting);
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

    private setTexture(asset: string)
    {
        this.texture  = Texture.from(asset);
    }

    private move(): void {
        this.isWalking = this.keyboardInput.pressedKeys.length > 0
        if (this.keyboardInput.isKeyPressed("ArrowUp") && this.position.y + this.top >= this.yMin) {
            this.y -= this.speed;
        }
        if (this.keyboardInput.isKeyPressed("ArrowRight") && this.position.x + this.right <= this.xMax) {

            this.scale.x = -this._settings.scale;
            this.x += this.speed;
        }
        if (this.keyboardInput.isKeyPressed("ArrowDown") && this.position.y + this.bottom <= this.yMax) {
            this.y += this.speed;
        }

        if (this.keyboardInput.isKeyPressed("ArrowLeft") && this.position.x + this.left >= this.xMin) {
            this.scale.x = this._settings.scale;
            this.x -= this.speed;
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
