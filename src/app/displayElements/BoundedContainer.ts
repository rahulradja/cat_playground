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
        return (newX - child.width/2 >= -this.width/2) && (newX + child.width/2 <= this.width/2)
        && (newY - child.height/2 >= -this.height/2) && (newY + child.height/2 <= this.height/2)
    }
}

export interface BoundedContainerSettings extends ContainerOptions
{
    canMoveChildTo?: (child: ResizableContainer, newX: number, newY: number) => boolean;
}