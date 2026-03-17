import { CatState } from "../screens/main/Cat";
import { KeyboardInput } from "./KeyboardInput";

export abstract class ICatController
{
    public abstract catState: CatState;
    public abstract get isGoingUp(): boolean;
    public abstract get isGoingDown(): boolean;
    public abstract get isGoingLeft(): boolean;
    public abstract get isGoingRight(): boolean;
}

export class CatKeyboardController implements ICatController
{
    public catState: CatState = CatState.Sitting;
    public get isGoingUp() { return this._keyboardInput.isKeyPressed("ArrowUp") ?? false };
    public get isGoingDown() { return this._keyboardInput.isKeyPressed("ArrowDown") ?? false };
    public get isGoingLeft() { return this._keyboardInput.isKeyPressed("ArrowLeft") ?? false };
    public get isGoingRight() { return this._keyboardInput.isKeyPressed("ArrowRight") ?? false };

    private _keyboardInput: KeyboardInput

    constructor()
    {
        this._keyboardInput = this.registerKeyboardInput()
    }

    private registerKeyboardInput(): KeyboardInput
    {
        const keyboardInput = new KeyboardInput();
        keyboardInput.trackKey("ArrowUp");
        keyboardInput.trackKey("ArrowDown");
        keyboardInput.trackKey("ArrowLeft");
        keyboardInput.trackKey("ArrowRight");
        return keyboardInput;
    }
}