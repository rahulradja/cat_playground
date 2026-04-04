import { Position } from "../../utils/Vector";
import { StringSettings, ToyString } from "./ToyString";
import * as PIXI from 'pixi.js'

export class CatWand<TSettings extends CatWandSettings = CatWandSettings> extends ToyString<TSettings>
{
    private _rodTip: Position = {x: 50, y: -50}
    private _rodBase: Position = {x: -50, y: 50}

    protected drawUpdate()
    {
        this.graphics.clear();
        this.graphics.moveTo(this._startPosition.x + this._rodBase.x, this._startPosition.y + this._rodBase.y)
            .lineTo(this._startPosition.x + this._rodTip.x, this._startPosition.y + this._rodTip.y)
            .stroke(this.settings.rod)
            .lineTo(this._rodSections[0].endPos.x + this._rodTip.x, this._rodSections[0].endPos.y + this._rodTip.y)

        for (let i=1; i<this._rodSections.length; i++)
        {
            this.graphics.lineTo(this._rodSections[i].endPos.x + this._rodTip.x, this._rodSections[i].endPos.y + this._rodTip.y)
                .stroke(this.settings.stroke)
        }
    }

}

export interface CatWandSettings extends StringSettings
{
    rod: PIXI.StrokeInput
}