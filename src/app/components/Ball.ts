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
        this.onParentChanged.on(() => this.updateMouseEvent())
    }

    public updateMouseEvent()
    {
        if (!this.parent) { return; }
        const mainContainer = this.parent
        mainContainer.eventMode = "dynamic"
        this._ballGraphics.eventMode = "dynamic";
        this._ballGraphics.on("mousedown", () => this.startDragging())
        this._ballGraphics.cursor = "pointer"
        mainContainer.on("mousemove", (e) =>
        {
            if (!this._isDragging || !this.parent) { return; }
            this.position = this.parent.toLocal(e.global)
            console.log(e.global)
        }) 
        mainContainer.addEventListener("mouseup", () => this._isDragging = false)

    }

    public update()
    {

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

        // this.eventMode = "dynamic"
        // this.parent?.on("mousemove", (e) =>
        // {
        //     if (!this._isDragging || !this.parent) { return; }
        //     this.position = this.parent.toLocal(e.global)
        //     console.log(e.global)
        // })                                                          
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