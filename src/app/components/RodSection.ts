import * as VECTOR from "../utils/Vector";

export class RodSection
{
    private _radius: number = 10
    private _startPos: VECTOR.Position = { x: 0, y: 0 }
    public get startPos() : VECTOR.Position { return this._startPos}
    private _endPos: VECTOR.Position = { x: 0, y: this._radius }
    public get endPos() { return this._endPos }
    private _rotVel: number = 0;

    /**theta measured from vertical downwards */
    // private _theta: number = 0;
    // public set theta(val: number)
    // {
    //     this._theta = val % (Math.PI * 2)
    //     this._endPos = { x: this._radius * Math.sin(this._theta) - this._startPos.x, y: this._radius * Math.cos(this._theta) - this.startPos.y}
    // }
    constructor() { }

    public update()
    {
        // if (this._rotVel === 0 && this._theta === 0) { return; }
        // const direction = VECTOR.Subtract(this._endPos, this.startPos)
        // const theta = Math.atan(direction.x/Math.abs(direction.y))
        // const rotAccel = -0.1 * Math.sin(theta) 
        // const newTheta = 0.98 * (theta + rotAccel)
        // this._endPos = {x: this._radius * Math.sin(newTheta) + this._startPos.x, y:  this._radius * Math.cos(newTheta) + this._startPos.y}

    }

    public updateStartPos(startPos: VECTOR.Position)
    {
        const direction = VECTOR.Subtract(this._endPos, startPos)
        const distance = VECTOR.Magnitude(direction)
        const newEndPos = { x: direction.x * this._radius/distance + startPos.x, y: direction.y * this._radius/distance + startPos.y}
        // this._theta = Math.atan(this._endPos.x/Math.abs(this._endPos.y))
        this._startPos = startPos
        const movement = VECTOR.Subtract(this._endPos, newEndPos)
        if (movement.x !== 0 || movement.y !== 0) { console.log(movement) }
        this._endPos = newEndPos
    }
}