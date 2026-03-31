import * as PIXI from "pixi.js"
import { ContainerSettings } from "../displayElements/ResizableContainer";
import { BoundedContainer } from "../displayElements/BoundedContainer";
import { Position } from "../utils/Vector";

export class DynamicObject<TSettings extends DynamicObjectSettings = DynamicObjectSettings> extends BoundedContainer<TSettings>
{
    public speed: Position = { x: 0, y: 0 }
    public get physicsProps(): PhysicsProperties
    { return {
        weight: this.settings.weight ?? 1,
        friction: this.settings.friction ?? 1,
        restitution: this.settings.restitution ?? 0.5
    }}
    protected _isDragging: boolean = false
    protected _object!: PIXI.ViewContainer
    constructor(public settings:TSettings)
    {
        super(settings);
        this.drawObject();
        this.onParentChanged.on(() => this.updateMouseEvent());
    }

    public updateMouseEvent()
    {
        if (!this.parent) { return; }
        this.parent.eventMode = "dynamic";
        this._object.eventMode = "dynamic";
        this._object.on("pointerdown", () => this.startDragging())
        this._object.cursor = "pointer"
        this.parent.on("pointermove", (e) =>
        {
            if (!this._isDragging || !this.parent) { return; }
            this.position = this.parent.toLocal(e.global)
            this.speed.x = e.movementX
            this.speed.y = e.movementY
        }) 
        this.parent.addEventListener("pointerup", () => this.handleMouseUp())
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
        this.speed.x = this.physicsProps.friction * this.speed.x;
        this.speed.y = this.physicsProps.friction * this.speed.y
    }

    protected handleMouseUp()
    {
        this._isDragging = false;
    }

    protected startDragging()
    {
        this._isDragging = true;
    }

    protected drawObject()
    {       
        this._object = new PIXI.Graphics();                                  
    }
}

export interface PhysicsProperties
{
    /** between [0, 1] - 1 is no friction, 0 is infinite friction */
    friction: number
    weight: number
    /** bounciness */
    restitution: number
}


export interface DynamicObjectSettings extends ContainerSettings, Partial<PhysicsProperties> {}