import { ContainerOptions, Size } from "pixi.js";
import { ResizableContainer } from "./ResizableContainer";

export class BoundedContainer<TSettings extends BoundedContainerSettings = BoundedContainerSettings> extends ResizableContainer<TSettings>
{
    public canMoveChildTo(child: ResizableContainer, newX: number, newY: number): boolean
    {
        if (this._settings.moveChildCheck)
        {
            return this._settings.moveChildCheck(child, {x: newX, y: newY}, {width: this.width, height: this.height}, {x: this.x, y: this.y});
        }
        const isWithinLeft = newX - child.width/2 >= this.x 
        const isWithinRight = newX + child.width/2 <= this.width + this.x
        const isWithinTop = newY - child.height/2 >= this.y
        const isWithinBottom = newY + child.height/2 <= this.height + this.y
        console.log(this.x, this.y, isWithinTop, isWithinBottom)
        return isWithinLeft && isWithinRight && isWithinBottom && isWithinTop;
    }
}
export interface Position { x: number, y: number }
export interface BoundedContainerSettings extends ContainerOptions
{
    moveChildCheck?: (child: ResizableContainer, newChildPos: Position, currentSize: Size, currentPos: Position) => boolean;
}