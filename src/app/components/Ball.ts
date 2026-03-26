import * as PIXI from "pixi.js"
import { ContainerSettings, ResizableContainer } from "../displayElements/ResizableContainer";
import { BoundedContainer, Position } from "../displayElements/BoundedContainer";


export class Ball<TSettings extends BallSettings = BallSettings> extends ResizableContainer<TSettings>
{
    public speed: Position = { x: 0, y: 0 }
    private _friction: number;
    private _ballGraphics: PIXI.Graphics = new PIXI.Graphics();
    private _shadowGraphics: PIXI.Graphics = new PIXI.Graphics();
    private _isDragging: boolean = false
    constructor(public settings:TSettings)
    {
        super(settings)
        this._friction = this.settings.friction ?? 1;
        this.drawBall()
        this.drawShadow()
        this.onParentChanged.on(() => this.updateMouseEvent())
    }

    public updateMouseEvent()
    {
        if (!this.parent) { return; }
        const mainContainer = this.parent
        mainContainer.eventMode = "dynamic"
        this._ballGraphics.eventMode = "dynamic";
        this._ballGraphics.on("pointerdown", () => this.startDragging())
        this._ballGraphics.cursor = "pointer"
        mainContainer.on("pointermove", (e) =>
        {
            if (!this._isDragging || !this.parent) { return; }
            this.position = this.parent.toLocal(e.global)
            this.speed.x = e.movementX
            this.speed.y = e.movementY
        }) 
        mainContainer.addEventListener("pointerup", () => this._isDragging = false)

    }

    public update(container: BoundedContainer)
    {
        if (this._isDragging) { return; }
        this.x += this.speed.x
        this.y += this.speed.y
        if (this.left <= container.left) { this.speed.x = Math.abs(this.speed.x) }
        if (this.right >= container.right) { this.speed.x = -Math.abs(this.speed.x) }
        if (this.top <= container.top) { this.speed.y = Math.abs(this.speed.y) }
        if (this.bottom >= container.bottom) { this.speed.y = -Math.abs(this.speed.y)}
        this.speed.x = this._friction * this.speed.x;
        this.speed.y = this._friction * this.speed.y
    }

    private startDragging()
    {
        console.log("dragging")
        this._isDragging = true;
    }

    private drawBall()
    {
        this.addChild(this._ballGraphics)
        this._ballGraphics.circle(0, 0, this._settings.radius).fill(this._settings.color);                                                
    }

    private drawShadow()
    {
        this._shadowGraphics.blendMode = 'multiply'
        this._shadowGraphics.ellipse(0, this._settings.radius, this._settings.radius, 5).fill("#22213f")
        this.addChildAt(this._shadowGraphics, 0)
        this._shadowGraphics.filters = new PIXI.BlurFilter({strength: 3, quality: 3, resolution: 3, kernelSize: 5}) 
    }
}

export interface BallSettings extends ContainerSettings
{
    color: PIXI.ColorSource,
    radius: number,
    /** between [0, 1] - 1 is no friction, 0 is infinite friction */
    friction?: number
}