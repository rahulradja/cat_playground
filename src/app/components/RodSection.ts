import * as VECTOR from "../utils/Vector";

export class RodSection
{
    public get startPos() : VECTOR.Position { return this._startPos}
    public get endPos() { return this._endPos }
    private _velocity: VECTOR.Position = {x: 0, y: 0}

    constructor(private _radius: number, private _startPos: VECTOR.Position, private _endPos: VECTOR.Position) { }

    public update()
    {
        const direction = VECTOR.Subtract(this._endPos, this.startPos)
        const theta = Math.atan(direction.x/Math.abs(direction.y))
        this._velocity = {x: this._velocity.x + 0.05 * Math.cos(theta) * Math.sin(theta), y: this._velocity.y + 0.01 * Math.pow(Math.cos(theta), 2)}
        const newEndDirection = { x: this._endPos.x + this._velocity.x - this._startPos.x, y: this._endPos.y + this._velocity.y - this._startPos.y}
        const distance = VECTOR.Magnitude(newEndDirection)
        this._endPos = VECTOR.Add(this._startPos, VECTOR.Multiply(newEndDirection, this._radius/distance))

    }

    public updateStartPos(startPos: VECTOR.Position)
    {
        const direction = VECTOR.Subtract(this._endPos, startPos)
        const distance = VECTOR.Magnitude(direction)
        const newEndPos = { x: direction.x * this._radius/distance + startPos.x, y: direction.y * this._radius/distance + startPos.y}
        this._startPos = startPos
        const movement = VECTOR.Subtract(this._endPos, newEndPos)
        if (movement.x !== 0 || movement.y !== 0) { console.log(movement) }
        this._endPos = newEndPos
    }
}