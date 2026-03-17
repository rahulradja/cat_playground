import {  Texture, AnimatedSprite, AnimatedSpriteFrames, Sprite, Graphics, FillGradient } from "pixi.js"
import * as PIXI from "pixi.js"
import { KeyboardInput } from "../../controllers/KeyboardInput"
import { BoundedContainer } from "../../displayElements/BoundedContainer";
import { BlendMode } from "@esotericsoftware/spine-pixi-v8";
import { ICatController } from "../../controllers/CatController";

export enum CatState { Walking, Standing, Sitting, Sleeping }

export class Cat extends BoundedContainer<CatSettings> {
    public speed!: number;
    private keyboardInput: KeyboardInput;

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

    constructor(protected _settings: CatSettings, private _catController: ICatController) {
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
        this.drawShadow();
    }

    public update(parent: BoundedContainer): void {
        this.move(parent);
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

    private drawShadow()
    {
        const shadow = new Graphics();
        shadow.blendMode = 'multiply'
        shadow.ellipse(0, 70, 80, 5).fill("#22213f")
        this.addChildAt(shadow, 0)
        shadow.filters = new PIXI.BlurFilter({strength: 5, quality: 5, resolution: 3, kernelSize: 5}) 
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

    private move(parent: BoundedContainer): void {
        if (this.keyboardInput.pressedKeys.length > 0)
        {
            this.setCatState(CatState.Walking)
        }
        else if (this._catState === CatState.Walking) { this.setCatState(CatState.Standing)}
        if (this._catController.isGoingUp && parent.canMoveChildTo(this, this.x, this.y - this.speed)) {
            this.y -= this.speed;
        }
        if (this._catController.isGoingRight && parent.canMoveChildTo(this, this.x + this.speed, this.y)) {
            this.scale.x = -this._settings.scale;
            this.x += this.speed;
        }
        if (this._catController.isGoingDown && parent.canMoveChildTo(this, this.x, this.y + this.speed)) {
            this.y += this.speed;
        }

        if (this._catController.isGoingLeft && parent.canMoveChildTo(this, this.x - this.speed, this.y)) {
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
