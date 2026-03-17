import { BLEND_MODES, FillInput, FillPattern, Graphics, Matrix, PatternRepetition, Texture, TextureOptions, TextureSource, TextureSourceLike } from "pixi.js";
import { BoundedContainer, BoundedContainerSettings } from "./BoundedContainer";
import { BlendMode } from "@esotericsoftware/spine-pixi-v8";

export class Background<TSettings extends BackgroundSettings = BackgroundSettings> extends BoundedContainer<TSettings>
{
    private _fill: Graphics;
    private _pattern: Graphics;

    constructor(protected _settings: TSettings)
    {
        super(_settings);
        this._fill = this.fillBackground();
        this._pattern = new Graphics()
        this.addChild(this._pattern)
    }

    public resize(width: number, height: number)
    {
        super.resize(width, height);
        this._fill.clear().rect(0, 0, width, height)
            .fill(this._settings.fill)
        this.addPattern()
    }

    private fillBackground(): Graphics
    {
        const graphics = new Graphics();
        this.addChild(graphics);
        graphics.rect(0, 0, this.width, this.height)
            .fill(this._settings.fill)
        return graphics
    }

    private addPattern()
    {
        if (!this._settings.pattern) { return; }
        this._pattern.clear()
        const texture: Texture = Texture.from(this._settings.pattern.source)
        const fillPattern =  new FillPattern(texture, this._settings.pattern.repeat || "repeat")
        fillPattern.transform = new Matrix()
        fillPattern.transform = this._settings.pattern.transform ?? new Matrix()
        
        this._pattern.rect(0, 0, this.width, this.height)
        this._pattern.fill(fillPattern)
        this._pattern.blendMode = this._settings.pattern.blendMode ?? "normal"
    }
}


export interface FillPatternSettings 
{
    source: string,
    repeat?: PatternRepetition,
    transform?: Matrix,
    blendMode?: BLEND_MODES
}

export interface BackgroundSettings extends BoundedContainerSettings
{
    fill: FillInput;
    pattern?: FillPatternSettings
}