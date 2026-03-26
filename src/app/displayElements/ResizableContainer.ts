import { Container, ContainerChild, ContainerOptions } from "pixi.js";
import { BasicEvent } from "../utils/Event";

export class ResizableContainer<TSettings extends ContainerSettings = ContainerSettings> extends Container
{
    public onParentChanged: BasicEvent = new BasicEvent()
    public get left() { return this.x - this.width/2 - this.pivot.x }
    public get right() { return this.x + this.width/2 - this.pivot.x }
    public get top() { return this.y - this.height/2 - this.pivot.y }
    public get bottom() { return this.y + this.height/2 - this.pivot.y }
            
    constructor(protected _settings: TSettings) { super(_settings) } 
    public resize(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.x = -width/2;
        this.y = -height/2
        if (this._settings.anchor)
        {
            this.pivot.x = (this._settings.anchor.x - 0.5) * width;
            this.pivot.y = (this._settings.anchor.y - 0.5) * height;
        }
    }
    
    public addChild<U extends ContainerChild[]>(...children: U): U[0]
    {
        const result = super.addChild(...children)  
        children.forEach((child) =>
        { if (child instanceof ResizableContainer)
        {
            child.onParentChanged.fire()
        }})
        return result;
    }
}

export interface ContainerSettings extends ContainerOptions
{
    /** x, y from 0-1 where 0.5 is the center */
    anchor?: { x: number, y: number }
}