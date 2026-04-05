import * as VECTOR from "../../utils/Vector";

export class RodSection
{
    public get startPos() : VECTOR.Position { return this._startPos }
    public get endPos() { return this._endPos }
        
    public get theta() 
    { 
        const direction = VECTOR.Subtract(this._endPos, this._startPos);
        return Math.atan(direction.x/Math.abs(direction.y))
    }
    private _velocity: VECTOR.Position = {x: 0, y: 0}

    constructor(private _radius: number, private _startPos: VECTOR.Position, private _endPos: VECTOR.Position, public gravity: number = 0.02) { }

    public update()
    {
        const theta = this.theta
        this._velocity = {x: this._velocity.x + this.gravity * Math.cos(theta) * Math.sin(theta), y: this._velocity.y + this.gravity * Math.pow(Math.cos(theta), 2)}
        const newEndDirection = { x: this._endPos.x + this._velocity.x - this._startPos.x, y: this._endPos.y + this._velocity.y - this._startPos.y}
        const distance = VECTOR.Magnitude(newEndDirection)
        this._endPos = VECTOR.Add(this._startPos, VECTOR.Multiply(newEndDirection, this._radius/distance))
    }

    public updateStartPos(startPos: VECTOR.Position)
    {
        const direction = VECTOR.Subtract(this._endPos, startPos)
        const distance = VECTOR.Magnitude(direction)
        this._startPos = startPos;
        this._endPos = { x: direction.x * this._radius/distance + startPos.x, y: direction.y * this._radius/distance + startPos.y}
    }

    public reset(startPos: VECTOR.Position)
    {
        this._startPos = startPos
        this._endPos = {x: this._startPos.x, y: this._startPos.y + this._radius}

        this._velocity = {x: 0, y: 0}
    }
}