import { ColorSource, Graphics, Size, Sprite, Texture } from "pixi.js";
import { ContainerSettings } from "../displayElements/ResizableContainer";
import { BoundedContainer } from "../displayElements/BoundedContainer";
import { BackpackItem } from "./BackpackItem";

export class Backpack extends BoundedContainer<BackpackSettings>
{
    private _backpackImage!: Sprite;
    private _background: Graphics = new Graphics();
    private _items: BackpackItem[] = [];
    public get items() { return this._items }

    constructor(protected _settings: BackpackSettings)
    {
        super(_settings)
        this.createElements();
        this.setPivotFromAnchor(_settings.background.size.width, _settings.background.size.height);
    }

    public updateItems(container: BoundedContainer)
    {
        this._items.forEach((item) =>
        {
            if (!item.isStashed) { item.update(container)}
            // item.isStashed = this.isIntersecting(item.item);
            item.zIndex = item.isStashed ? this.zIndex + 1 : 0;
        })
    }

    public resize(width: number, height: number)
    {
        this.position.set(-width/2, height/2)
        this.moveStashedItems()
    }

    public addToBackpack(...objects: BackpackItem[])
    {
        objects.forEach((item) =>
        {
            this._items.push(item);
            item.setBackpack(this);
            if (!item.parent || !this.parent){ return; }
            item.position = this.parent?.toGlobal(this.position)
        })
    }

    public stashAll()
    {
        this._items.forEach((item) => item.isStashed = true)
        this.moveStashedItems();
    }

    private moveStashedItems()
    {
        let startingPosition = this.position.x + this._backpackImage.width + 50;
        this._items.forEach((item) => 
        {  
            if (!item.parent || !item.isStashed){ return; }
            item.zIndex = this.zIndex + 1;
            item.position.set(startingPosition, this.position.y - 60 );
            item.speed = { x: 0, y: 0 }
            startingPosition += item.width;
        })
    }

    private createElements()
    {
        const { backpackAsset, background } = this._settings
        this._backpackImage = new Sprite({texture: Texture.from(backpackAsset), scale: 0.09});
        this._backpackImage.eventMode = "static";
        this._backpackImage.cursor = "pointer"
        this._backpackImage.on("click", () => this.stashAll());
        this.addChild(this._background, this._backpackImage)
        this._background.roundRect(0, 0, background.size.width, background.size.height, background.radius).fill(background.color ?? "#ffffffbb")
    }
}

export interface BackpackSettings extends ContainerSettings
{
    backpackAsset: string;
    background:
    {
        color?: ColorSource;
        size: Size;
        radius?: number
    }
}

export const defaultBackpackSettings: BackpackSettings =
{
    backpackAsset: "backpack.png",
    anchor: { x: 0.45, y: 1.6 },
    background:
    {
        size: { width: 500, height: 100 },
        radius: 20
    }
}