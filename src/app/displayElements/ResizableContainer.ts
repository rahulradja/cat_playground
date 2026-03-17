import { Container, ContainerOptions } from "pixi.js";

export class ResizableContainer<TSettings extends ContainerOptions = ContainerOptions> extends Container
{
    constructor(protected _settings: TSettings) { super(_settings) } 
    public resize(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.x = -width/2;
        this.y = -height/2
    }
}