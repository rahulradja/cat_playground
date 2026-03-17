import { Container, ContainerOptions } from "pixi.js";

export class ResizableContainer<TSettings extends ContainerOptions = ContainerOptions> extends Container
{
    public get bounds(){ return { top: this.y - this.height/2, bottom: this.y + this.height/2, right: this.x + this.width/2 , left: this.x - this.width/2 }}

    constructor(protected _settings: TSettings) { super(_settings) } 
    public resize(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.x = -width/2;
        this.y = -height/2
    }
}