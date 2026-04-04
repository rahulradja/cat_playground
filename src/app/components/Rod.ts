import { BoundedContainer } from "../displayElements/BoundedContainer";
import { Position } from "../utils/Vector";
import { BackpackItem } from "./BackpackItem";
import * as PIXI from "pixi.js"

export class Rod extends BackpackItem
{
    private _radius: number = 100
    private _endPos: Position = { x: 0, y: this._radius }
    private get graphics()
    {
        return this._object as PIXI.Graphics
    }

    private _theta: number = 0;
    public set theta(val: number)
    {
        this._endPos = { x: this._radius * Math.sin(val), y: this._radius * Math.cos(val)}
        this.drawUpdate();
        this._theta = val
    }

    public update(container: BoundedContainer)
    {
        super.update(container)
        this.theta = this._theta > 0 ? Math.max(0, this._theta - 0.1) : Math.min(0, this._theta + 0.1)
    }

    protected handleMouseMove(e: PIXI.FederatedMouseEvent)
    {
        if (!this._isDragging.value || !this.parent) { return; }
        this.position = this.parent.toLocal(e.global)
        // this.speed.x = e.movementX
        // this.speed.y = e.movementY
        this.theta = Math.min(Math.PI/2, Math.max(-Math.PI/2, this._theta - Math.atan(e.movementX/this._radius)))
    }

    protected drawUpdate()
    {
        this.graphics.clear();
        this.graphics.moveTo(0, 0);
        if (!this._endPos) { this._endPos = { x: 0, y: 100 }}
        this.graphics.lineTo(this._endPos.x, this._endPos.y).stroke({ color: "#6b1000", width: 20 })
    }

    protected drawObject()
    {       
        const object = new PIXI.Graphics();   
        this.addChild(object)
        this._object = object                
        this.drawUpdate()           
    }
}