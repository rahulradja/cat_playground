import { Observable } from "../utils/Observable";
import { Backpack } from "./Backpack";
import { DynamicObject, DynamicObjectSettings } from "./DynamicObject";

export class BackpackItem<TSettings extends DynamicObjectSettings = DynamicObjectSettings> extends DynamicObject<TSettings>
{
    public isStashed: Observable<boolean> = new Observable(true);
    protected _backpack!: Backpack;

    public setBackpack(backpack: Backpack)
    {
        this._backpack = backpack
    }

    protected handleMouseUp()
    {
        this._isDragging = false;
        if (!this._backpack) { return; }
        this.isStashed.value = this.isIntersecting(this._backpack);
        this.zIndex = this.isStashed.value ? this._backpack.zIndex + 1 : 0
    }

    protected startDragging()
    {
        super.startDragging();
        if (!this._backpack) { return; }
        this.zIndex = this._backpack.zIndex + 1 ;
    }
}