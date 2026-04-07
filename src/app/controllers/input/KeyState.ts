import { BasicEvent } from "../../utils/Event"

export class KeyState
{
    private _isKeyPressed: boolean = false
    public get isKeyPressed() { return this._isKeyPressed}
    public keyPressed: BasicEvent = new BasicEvent();

    constructor(public keyCode: string)
    {
        window.addEventListener("keydown", (e) => {
            if (e.key === this.keyCode) 
            { 
                if (!this._isKeyPressed) { this.keyPressed.fire() }
                this._isKeyPressed = true;
            }
        })

        window.addEventListener("keyup", (e) => {
            if (e.key === this.keyCode) { this._isKeyPressed = false}
        })
    }
}