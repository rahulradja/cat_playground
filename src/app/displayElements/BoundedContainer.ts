import { ContainerSettings, ResizableContainer } from "./ResizableContainer";

/** For containers that can move within the bounds of another container */
export class BoundedContainer<TSettings extends ContainerSettings =ContainerSettings> extends ResizableContainer<TSettings>
{
    public canMoveChildTo(child: ResizableContainer, newX: number, newY: number): boolean
    {
        const isWithinLeft = child.left - child.x + newX >= this.left
        const isWithinRight = child.right - child.x + newX <= this.right
        const isWithinTop = child.top - child.y + newY >= this.top
        const isWithinBottom = child.bottom - child.y + newY <= this.bottom
        return isWithinLeft && isWithinRight && isWithinBottom && isWithinTop;
    }

    public isIntersecting(otherObject: BoundedContainer): boolean
    {
        return otherObject.right >= this.left && otherObject.left <= this.right
            && otherObject.bottom >= this.top && otherObject.top <= this.bottom
    }

    public handleCollision(): void
    {

    }
}
export interface Position { x: number, y: number }