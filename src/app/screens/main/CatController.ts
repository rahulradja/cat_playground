import { Texture, AnimatedSprite, AnimatedSpriteFrames, Sprite } from "pixi.js"
import { KeyboardInput } from "../../controllers/KeyboardInput"
import { ResizableContainer } from "../../displayElements/ResizableContainer";

export enum CatState { Walking, Standing, Sitting, Sleeping }

export class CatController extends ResizableContainer<CatSettings> {
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

    private _catState: CatState = CatState.Sleeping;

    private _walkingSprite: AnimatedSprite;
    private _sittingSprite: Sprite;
    private _sleepingSprite: Sprite;

    private _nextStatePromise: { resolve: (success: boolean) => void, reject:(reason?: any) => void } | undefined;

    constructor(protected _settings: CatSettings) {
        super(_settings);
        this.speed = this._settings.walkingSpeed
        this.keyboardInput = this.registerKeyboardInput()
        this._walkingSprite = this.createWalkingSprite();
        this._sittingSprite = new Sprite({texture: Texture.from(_settings.sitting)});
        this._sleepingSprite = new Sprite({texture: Texture.from(_settings.sleeping)});
        this.addChild(this._sittingSprite);
        this.addChild(this._sleepingSprite);
        this._sittingSprite.position = { x: -this._sittingSprite.width/2, y: -this._sittingSprite.height/2}
        this._sleepingSprite.position = { x: -this._sleepingSprite.width/2, y: -this._sleepingSprite.height/2}
        this.setCatState(CatState.Sitting);
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

    private registerKeyboardInput(): KeyboardInput
    {
        const keyboardInput = new KeyboardInput();
        keyboardInput.trackKey("ArrowUp");
        keyboardInput.trackKey("ArrowDown");
        keyboardInput.trackKey("ArrowLeft");
        keyboardInput.trackKey("ArrowRight");
        return keyboardInput;
    }

    private setCatState(newState: CatState)
    {
        if (newState === this._catState) { return; }
        this._catState = newState;
        this._nextStatePromise?.resolve(false);
        this._sittingSprite.visible = newState === CatState.Sitting;
        this._walkingSprite.visible = newState === CatState.Walking || newState === CatState.Standing;
        this._sleepingSprite.visible = newState === CatState.Sleeping;
        if (newState === CatState.Walking)
        {
            this._walkingSprite.play()
        }
        else { this._walkingSprite.stop() }
        if (newState === CatState.Standing)
        {
            this.nextStateTimeout(CatState.Sitting, 2000)
        }
        else if (newState === CatState.Sitting)
        {
            this.nextStateTimeout(CatState.Sleeping, 5000)
        }
    }

    /**Goes to next state after a specified timeout */
    private async nextStateTimeout(nextState: CatState, time: number): Promise<void>
    {
        const statePromise = new Promise<boolean>((resolve, reject) => 
        {
            this._nextStatePromise = { resolve, reject }
            setTimeout(() => resolve(true), time)
        })
        statePromise.then((val) => {
            if (val) { this.setCatState(nextState) }
        })
    }

    private createWalkingSprite(): AnimatedSprite
    {
        const spriteFrame: AnimatedSpriteFrames = this._settings.walkingFrames.map((frame) => Texture.from(frame))
        const walkingSprite = new AnimatedSprite({textures: spriteFrame, animationSpeed: 0.05, loop: true});
        walkingSprite.play();
        this.addChild(walkingSprite);
        walkingSprite.position = {x: -walkingSprite.width/2, y: -walkingSprite.height/2}
        return walkingSprite;
    }

    private move(): void {
        if (this.keyboardInput.pressedKeys.length > 0)
        {
            this.setCatState(CatState.Walking)
        }
        else if (this._catState === CatState.Walking) { this.setCatState(CatState.Standing)}
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
    sleeping: string;
    scale: number
}
