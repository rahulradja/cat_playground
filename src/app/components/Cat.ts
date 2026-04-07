import {  Texture, AnimatedSprite, AnimatedSpriteFrames, Sprite, Graphics } from "pixi.js"
import * as PIXI from "pixi.js"
import { BoundedContainer } from "../displayElements/BoundedContainer";
import { CatKeyboardController, ICatController } from "../controllers/catControllers/CatController";

export enum CatState { Walking, Standing, Sitting, Sleeping, InBed }

export class Cat extends BoundedContainer<CatSettings> {
    public speed!: number;

    public get isUserControlled() { return this._catController instanceof CatKeyboardController }
    public get top() { return this.y + this.height/2 - 30 - this.pivot.y }

    private _catState: CatState = CatState.Sleeping;

    private _walkingSprite: AnimatedSprite;
    private _sittingSprite: Sprite;
    private _sleepingSprite: Sprite;

    public get onKeyPressed() 
    { 
        if (this._catController instanceof CatKeyboardController)
        {
            return (this._catController as CatKeyboardController).onKeyPressed
        }
        return null;
    }

    private _nextStatePromise: { resolve: (success: boolean) => void, reject:(reason?: unknown) => void } | undefined;

    constructor(protected _settings: CatSettings, private _catController: ICatController) {
        super(_settings);
        this.speed = this._settings.walkingSpeed
        this._walkingSprite = this.createWalkingSprite();
        this._sittingSprite = new Sprite({texture: Texture.from(_settings.color + "/" + _settings.sitting)});
        this._sleepingSprite = new Sprite({texture: Texture.from(_settings.color + "/" + _settings.sleeping)});
        this.addChild(this._sittingSprite);
        this.addChild(this._sleepingSprite);
        this._sittingSprite.scale = _settings.desiredWidth/this._sittingSprite.width
        this._sittingSprite.y = this._sittingSprite.height + this._walkingSprite.height/2
        this._sleepingSprite.scale = _settings.desiredWidth/this._sleepingSprite.width
        this._sittingSprite.position = { x: -this._sittingSprite.width/2, y: this._walkingSprite.height/2 - this._sittingSprite.height}
        this._sleepingSprite.position = { x: -this._sleepingSprite.width/2, y: this._walkingSprite.height/2 - this._sleepingSprite.height}
        this.setCatState(CatState.Sitting);
        this.drawShadow();
    }

    public update(parent: BoundedContainer): void 
    {
        if (this._catState === CatState.InBed) { return; }
        this.move(parent);
    }
    
    public stop()
    {
        this._catController.handleCatCollision()
    }

    public setIsInBed(val: boolean)
    {
        if (val)
        {
            this.setCatState(CatState.InBed);
            return; 
        }
        this.setCatState(CatState.Standing)
    }
    
    private setCatState(newState: CatState)
    {
        if (newState === this._catState) { return; }
        this._catState = newState;
        this._nextStatePromise?.resolve(false);
        this._sittingSprite.visible = newState === CatState.Sitting;
        this._walkingSprite.visible = newState === CatState.Walking || newState === CatState.Standing;
        this._sleepingSprite.visible = newState === CatState.Sleeping || newState === CatState.InBed
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
        const spriteFrame: AnimatedSpriteFrames = this._settings.walkingFrames.map((frame) => Texture.from(this._settings.color + "/" + frame))
        const walkingSprite = new AnimatedSprite({textures: spriteFrame, animationSpeed: 0.05, loop: true});
        walkingSprite.play();
        this.addChild(walkingSprite);
        walkingSprite.scale = this._settings.desiredWidth/walkingSprite.width
        walkingSprite.position = {x: -walkingSprite.width/2, y: -walkingSprite.height/2}
        return walkingSprite;
    }

    private move(parent: BoundedContainer): void {
        let isMoving: boolean = false;
        if (this._catController.isGoingUp && parent.canMoveChildTo(this, this.x, this.y - this.speed)) {
            this.y -= this.speed;
            isMoving = true;
        }
        if (this._catController.isGoingRight && parent.canMoveChildTo(this, this.x + this.speed, this.y)) {
            this.scale.x = -Math.abs(this.scale.x)
            this.x += this.speed;
            isMoving = true;
        }
        if (this._catController.isGoingDown && parent.canMoveChildTo(this, this.x, this.y + this.speed)) {
            this.y += this.speed;
            isMoving = true;
        }

        if (this._catController.isGoingLeft && parent.canMoveChildTo(this, this.x - this.speed, this.y)) {
            this.scale.x = Math.abs(this.scale.x)
            this.x -= this.speed;
            isMoving = true;
        }
        if (isMoving) { this.setCatState(CatState.Walking) }
        else if (this._catState === CatState.Walking) { this.setCatState(CatState.Standing)}
    }
}

export interface CatSettings
{
    color: string;
    walkingFrames: string[];
    sitting: string,
    walkingSpeed: number;
    sleeping: string;
    desiredWidth: number,
    scale: number
}
