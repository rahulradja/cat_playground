import { BoundedContainer } from "../displayElements/BoundedContainer";
import { Magnitude, Position } from "../utils/Vector";
import { BackpackItem } from "./BackpackItem";
import * as PIXI from "pixi.js"

export class Rod extends BackpackItem
{
    private _radius: number = 100
    private _endPos: Position = { x: 0, y: this._radius }
    private _rotVel: number = 0;
    private get graphics()
    {
        return this._object as PIXI.Graphics
    }

    /**theta measured from vertical downwards */
    private _theta: number = 0;
    public set theta(val: number)
    {
        this._theta = val % (Math.PI * 2)
        this._endPos = { x: this._radius * Math.sin(this._theta), y: this._radius * Math.cos(this._theta)}
        this.drawUpdate();
    }

    public update(container: BoundedContainer)
    {
        super.update(container)
        if (this._rotVel === 0 && this._theta === 0) { return; }
        const rotAccel = -0.1 * Math.sin(this._theta) 
        this.theta = this._theta + rotAccel
    }

    protected handleMouseMove(e: PIXI.FederatedMouseEvent)
    {
        if (!this._isDragging.value || !this.parent) { return; }
        this.position = this.parent.toLocal(e.global)
        const endDirection = {x:this._endPos.x - e.movementX, y: this._endPos.y - e.movementY}
        const distance = Magnitude(endDirection)
        this._endPos = { x: endDirection.x * this._radius/distance, y: endDirection.y * this._radius/distance}
        this._theta = Math.atan(this._endPos.x/Math.abs(this._endPos.y))
        this.drawUpdate();    
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