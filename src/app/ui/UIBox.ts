import { Container, Graphics, ColorSource, StrokeStyle } from "pixi.js";

export class UIBox extends Container
{
    protected _graphics: Graphics = new Graphics()
    constructor(private _settings: UIBoxSettings)
    {
        super()
        this.drawBox()
    }

    private drawBox()
    {
        this.addChild(this._graphics)
        const { size, primaryColor, secondaryColor, border, radius, backingOffset, graphicsPosition } = this._settings
        const borderWidth = border.width ?? 0
        const xPos = (graphicsPosition?.x ?? -size.w/2)
        const yPos = graphicsPosition?.y ?? -size.h/2
        this._graphics
            .roundRect( xPos -borderWidth/2 + backingOffset.x, 
                yPos -borderWidth/2 + backingOffset.y,
                size.w +  borderWidth, 
                size.h + borderWidth,
                radius + borderWidth)
            .fill({color: secondaryColor})
            .roundRect(xPos, yPos, size.w, size.h, radius)
            .fill({color: primaryColor})
            .stroke(border)
    }

    /** Get the base width, without counting the shadow */
    public get boxWidth() {
        return this._graphics.width;
    }

    /** Get the base height, without counting the shadow */
    public get boxHeight() {
        return this._graphics.height;
    }
}

export interface UIBoxSettings
{
    primaryColor: ColorSource;
    border: StrokeStyle;
    secondaryColor: ColorSource;
    size: { w: number, h: number };
    radius: number;
    backingOffset: { x: number, y: number };
    graphicsPosition?: { x: number, y: number };
}

export const DefaultUIBoxSettings: UIBoxSettings =
{ 
    radius: 50, 
    primaryColor: '#a5c6eb', 
    border: { color: '#26265f', width: 20 }, 
    secondaryColor: '#575dd6', 
    size: {w: 400, h: 400},
    backingOffset: { x: 10, y: 10 }
}
