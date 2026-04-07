import { BoundedContainer } from "../../displayElements/BoundedContainer";
import { ContainerSettings  } from "../../displayElements/ResizableContainer";
import * as PIXI from 'pixi.js';
import { Cat } from "../Cat";

export class CatBed<TSettings extends CatBedSettings = CatBedSettings> extends BoundedContainer<CatBedSettings>
{
    public get isOccupied() { return this._cat !== null }
    private _front: PIXI.Sprite;
    private _back: PIXI.Sprite;

    public _cat: Cat | null = null;
    public get cat(): Cat | null { return this._cat }
    public set cat(val: Cat | null)
    {
        if (val !== null && this._cat !== null) { return; }
        this._cat = val
    }

    constructor(settings: TSettings)
    {
        super(settings)
        this._front = new PIXI.Sprite({texture: PIXI.Texture.from(this._settings.frontAsset)})
        this._back = new PIXI.Sprite({texture: PIXI.Texture.from(this._settings.backAsset)})
        this.addChild(this._front, this._back)
        this._front.zIndex = 1;
        this._back.zIndex = -1
    }
}

export interface CatBedSettings extends ContainerSettings
{
    frontAsset: string;
    backAsset: string;
}