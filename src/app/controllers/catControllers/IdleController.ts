import { Ticker } from "pixi.js";
import { CatState } from "../../components/Cat";
import { ICatController } from "./CatController"
import { randomArrayElement } from "../../utils/TypeUtils";
import { Observable } from "../../utils/Observable";

export class IdleController implements ICatController
{
    public catState: CatState = CatState.Sitting;
    public get activeDirections() { return [this.isGoingDown, this.isGoingUp, this.isGoingLeft, this.isGoingRight].filter((obs) => obs === true) };
    public get isGoingUp() { return this._isGoingUp.value && !this._isGoingDown.value; };
    public get isGoingDown() { return this._isGoingDown.value && !this._isGoingUp.value; };
    public get isGoingLeft() { return this._isGoingLeft.value && !this._isGoingRight.value; };
    public get isGoingRight() { return this._isGoingRight.value && !this._isGoingLeft.value; };
    private _isGoingUp: Observable<boolean> = new Observable(false);
    private _isGoingLeft:  Observable<boolean> = new Observable(false);
    private _isGoingDown:  Observable<boolean> = new Observable(false);
    private _isGoingRight:  Observable<boolean> = new Observable(false);
    private _ticker: Ticker

    constructor()
    {
        this._ticker = new Ticker();
        this._ticker.start();
        this._ticker.add(() => this.randomStart())
    }

    private randomStart(): boolean
    {
        if (Math.random() > 0.01) { return false; }
        const direction: Observable<boolean> = randomArrayElement([this._isGoingDown, this._isGoingRight, this._isGoingLeft, this._isGoingUp])
        direction.value = true;
        const promise = new Promise<void>((resolve) => 
        {
            setTimeout(() => resolve(), Math.random() * 3000 + 5000)
        })
        promise.then(() => direction.value = false)
        return true
    }
}