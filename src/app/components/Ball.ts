import * as PIXI from "pixi.js"
import { BoundedContainer, Position } from "../displayElements/BoundedContainer";
import { DynamicObjectSettings } from "./DynamicObject";
import { BackpackItem } from "./BackpackItem";


export class Ball<TSettings extends BallSettings = BallSettings> extends BackpackItem<TSettings>
{
    public speed: Position = { x: 0, y: 0 }
    private _shadowGraphics: PIXI.Graphics = new PIXI.Graphics();
    constructor(public settings:TSettings)
    {
        super(settings);
        this.drawShadow()
    }

    public update(container: BoundedContainer)
    {
        if (this._isDragging) { return; }
        super.update(container);
        this._object.rotation += this.speed.x / (Math.PI * this.settings.radius)
    }

    protected drawObject()
    {
        if (this.settings.asset)
        {
            const texture = PIXI.Texture.from(this.settings.asset)
            this._object = new PIXI.Sprite({texture, scale: 2*this.settings.radius/texture.width  });
            this.addChild(this._object);
            this._object.pivot.set(this.settings.radius / this._object.scale.x, this.settings.radius / this._object.scale.y)
            return;
        }
        const object = new PIXI.Graphics()
        this.addChild(object)
        object.circle(0, 0, this._settings.radius).fill(this._settings.color);        
        this._object = object;                                        
    }

    protected drawShadow()
    {
        this._shadowGraphics.blendMode = 'multiply'
        this._shadowGraphics.ellipse(0, this._settings.radius, this._settings.radius, 5).fill("#22213f")
        this.addChildAt(this._shadowGraphics, 0)
        this._shadowGraphics.filters = new PIXI.BlurFilter({strength: 3, quality: 3, resolution: 3, kernelSize: 5}) 
    }
}

export interface BallSettings extends DynamicObjectSettings
{
    color: PIXI.ColorSource,
    asset?: string;
    radius: number,
}