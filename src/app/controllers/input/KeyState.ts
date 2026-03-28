export class KeyState
{
    private _isKeyPressed: boolean = false
    public get isKeyPressed() { return this._isKeyPressed}

    constructor(public keyCode: string)
    {
        window.addEventListener("keydown", (e) => {
            if (e.key === this.keyCode) { this._isKeyPressed = true}
        })

        window.addEventListener("keyup", (e) => {
            if (e.key === this.keyCode) { this._isKeyPressed = false}
        })
    }
}