import { ColorSource, ContainerOptions, Graphics } from "pixi.js";
import { ResizableContainer } from "./ResizableContainer";

export class Background<TSettings extends BackgroundSettings = BackgroundSettings> extends ResizableContainer<TSettings>
{
    private _fill: Graphics;
    constructor(protected _settings: TSettings)
    {
        super(_settings);
        this._fill = this.fillBackground();
    }

    public resize(width: number, height: number)
    {
        super.resize(width, height);
        this._fill.clear().rect(0, 0, width, height)
            .fill({color: this._settings.fill})
    }

    private fillBackground(): Graphics
    {
        const graphics = new Graphics();
        this.addChild(graphics);
        graphics.rect(0, 0, this.width, this.height)
            .fill({color: this._settings.fill})
        return graphics
    }
}

export interface BackgroundSettings extends ContainerOptions
{
    fill: ColorSource
}