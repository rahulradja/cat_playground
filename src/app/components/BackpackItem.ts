import { Observable } from "../utils/Observable";
import { Backpack } from "./Backpack";
import { DynamicObject, DynamicObjectSettings } from "./DynamicObject";

export class BackpackItem<TSettings extends DynamicObjectSettings = DynamicObjectSettings> extends DynamicObject<TSettings>
{
    protected _isStashed: Observable<boolean> = new Observable(true);
    public get isStashed(){ return this._isStashed.value}
    public set isStashed(val: boolean){ this._isStashed.value = val }
    protected _backpack!: Backpack;

    public setBackpack(backpack: Backpack)
    {
        this._backpack = backpack
    }

    protected handleMouseUp()
    {
        this._isDragging = false;
        if (!this._backpack) { return; }
        this._isStashed.value = this.isIntersecting(this._backpack)
    }
}