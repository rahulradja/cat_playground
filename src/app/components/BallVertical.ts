import { Ball, BallSettings } from "./Ball";
import { BoundedContainer } from "../displayElements/BoundedContainer";

export class BallVertical<TSettings extends BallVerticalSettings = BallVerticalSettings> extends Ball<TSettings>
{
    public gravity = 0.98;
    public get left() { return this.position.x - this._object.width/2 - this.pivot.x }
    public get right() { return this.position.x + this._object.width/2 - this.pivot.x }
    public get top() { return this.position.y - this._object.height/2 - this.pivot.y + this._zPos/2 }
    public get bottom() { return this.position.y + this._object.height/2 - this.pivot.y }

    protected _zPos: number = 0
    private set zPos(val: number)
    {
        if (isNaN(val)){ throw new Error("invalid height set for ball")}
        const deltaHeight = val - this._zPos;
        this._object.position.y -= deltaHeight;
        this._zPos = val;
    }
    public get zPos(){ return this._zPos }

    constructor(_settings:TSettings)
    {
        super(_settings)
        this._isDragging.onChanged(() => 
        {
            if (this._settings.pickUpHeight && this._settings.pickUpHeight > 0 && this._isDragging.value)
            {
                this.zPos = this._settings.pickUpHeight
            }
        });
        this.isStashed.onChanged(() =>{ if (this.isStashed.value) { this.zPos = 0}})
    }

    public update(container: BoundedContainer)
    {
        if (this._isDragging.value || this.isStashed.value) { return; }
        super.update(container);
        this.speed.z = this.getNewZSpeed();
        this.zPos = Math.max(0, this._zPos - this.speed.z)
        this._object.rotation += this.speed.x / (Math.PI * this.settings.radius)
    }

    public isIntersecting(otherObject: BallVertical): boolean
    public isIntersecting(otherObject: BoundedContainer): boolean
    public isIntersecting(otherObject: BoundedContainer | BallVertical): boolean
    {
        const otherZPos = otherObject instanceof BallVertical ? otherObject.zPos : 0;
        if (otherZPos - this.zPos > (this.collidableHeight + otherObject.height)/2) { return false; }
        const result = otherObject.right >= this.left && otherObject.left <= this.right
            && otherObject.bottom >= this.top && otherObject.top <= this.bottom
        return result;
    }

    private getNewZSpeed(): number
    {
        if (this._zPos > this.gravity){ return this.speed.z + this.gravity }
        if (Math.abs(this.speed.z) < this.gravity) { return 0; }
        return -Math.sqrt(this.physicsProps.restitution) * this.speed.z
    }
    
}

export interface BallVerticalSettings extends BallSettings
{
    pickUpHeight?: number
}