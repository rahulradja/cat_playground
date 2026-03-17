import { Container } from "pixi.js";
import { Background, BackgroundSettings } from "./Background";

export class Floor extends Background<BackgroundSettings>
{
    public placeElementOnFloor(element:Container, relativeX: number = 0.5, relativeY: number = 0.5)
    {
        this.addChild(element);
        element.x = (relativeX - 0.5) * this.width;
        element.y = (relativeY - 0.5) * this.height;  
    }
}