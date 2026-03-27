import { BLEND_MODES, FillInput, FillPattern, Graphics, Matrix, PatternRepetition, Texture } from "pixi.js";
import { BoundedContainer } from "./BoundedContainer";
import { ContainerSettings } from "./ResizableContainer";

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
        this.drawRect(this._fill, width, height).fill(this._settings.fill)
        this.addPattern()
    }
    
    private drawRect(fill: Graphics, width?: number, height?: number): Graphics
    {
        width = width ?? this.width;
        height = height ?? this.height;
        fill.clear().rect(-width/2 , -height/2, width, height)
        return fill
    }

    private fillBackground(): Graphics
    {
        const graphics = new Graphics();
        this.addChild(graphics);
        this.drawRect(graphics).fill(this._settings.fill)
        return graphics
    }

    private addPattern(width?: number, height?: number)
    {
        if (!this._settings.pattern) { return; }
        width = width ?? this.width;
        height = height ?? this.height;
        this._pattern.clear()
        const texture: Texture = Texture.from(this._settings.pattern.source)
        const fillPattern =  new FillPattern(texture, this._settings.pattern.repeat || "repeat")
        fillPattern.transform = new Matrix().scale(height/width, 1) // scale it to retain aspect ratio
        if (this._settings.pattern.transform) {fillPattern.transform.append(this._settings.pattern.transform)}
        
        this._pattern = this.drawRect(this._pattern, width, height).fill(fillPattern)
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

export interface BackgroundSettings extends ContainerSettings
{
    fill: FillInput;
    pattern?: FillPatternSettings
}