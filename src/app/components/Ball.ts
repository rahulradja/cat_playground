import * as PIXI from "pixi.js"
import { ContainerSettings, ResizableContainer } from "../displayElements/ResizableContainer";


export class Ball<TSettings extends BallSettings = BallSettings> extends ResizableContainer<TSettings>
{
    private _ballGraphics: PIXI.Graphics = new PIXI.Graphics();
    private _shadowGraphics: PIXI.Graphics = new PIXI.Graphics();
    private _isDragging: boolean = false
    constructor(settings:TSettings)
    {
        super(settings)
        this.drawBall()
        this.drawShadow()

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
        this._ballGraphics.eventMode = "dynamic";
        this._ballGraphics.on("mousedown", () => this.startDragging())
        this._ballGraphics.cursor = "pointer"
        this.eventMode = "dynamic"
        globalThis.addEventListener("mousemove", (e) =>
        {
            if (!this._isDragging || !this.parent) { return; }
            const pos = (this.parent.toLocal({x: e.clientX, y: e.clientY}))
            this.position = pos
            console.log(e.clientX, e.clientY, pos)
        })
        globalThis.addEventListener("mouseup", () => this._isDragging = false)
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
    radius: number
}