import { ContainerOptions } from "pixi.js";
import { ResizableContainer } from "./ResizableContainer";

export class BoundedContainer<TSettings extends BoundedContainerSettings = BoundedContainerSettings> extends ResizableContainer<TSettings>
{
    public canMoveChildTo(child: ResizableContainer, newX: number, newY: number): boolean
    {
        if (this._settings.canMoveChildTo)
        {
            return this.canMoveChildTo(child, newX, newY);
        }
        const isWithinLeft = newX - child.width/2 >= this.x 
        const isWithinRight = newX + child.width/2 <= this.width + this.x
        const isWithinTop = newY - child.height/2 >= this.y
        const isWithinBottom = newY + child.height/2 <= this.height + this.y
        console.log(this.x, this.y, isWithinTop, isWithinBottom)
        return isWithinLeft && isWithinRight && isWithinBottom && isWithinTop;
    }
}

export interface BoundedContainerSettings extends ContainerOptions
{
    canMoveChildTo?: (child: ResizableContainer, newX: number, newY: number) => boolean;
}