import { ContainerSettings, ResizableContainer } from "./ResizableContainer";

/** For containers that can move within the bounds of another container */
export class BoundedContainer<TSettings extends ContainerSettings = ContainerSettings> extends ResizableContainer<TSettings>
{
    public blockingObjects: BoundedContainer[] = [];
    public canMoveChildTo(child: BoundedContainer, newX: number, newY: number): boolean
    {
        const isWithinLeft = child.left - child.x + newX >= this.left
        const isWithinRight = child.right - child.x + newX <= this.right
        const isWithinTop = child.top - child.y + newY >= this.top
        const isWithinBottom = child.bottom - child.y + newY <= this.bottom
        const wontIntersectBlocked = this.blockingObjects.length === 0 || this.blockingObjects.every((obj) => !obj.isIntersecting(child))
        if (!wontIntersectBlocked) { console.log("blocked")}
        return isWithinLeft && isWithinRight && isWithinBottom && isWithinTop && wontIntersectBlocked
    }

    public isIntersecting(otherObject: BoundedContainer): boolean
    {
        const result = otherObject.right >= this.left && otherObject.left <= this.right
            && otherObject.bottom >= this.top && otherObject.top <= this.bottom
        return result;
    }
}