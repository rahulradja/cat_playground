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

    public get left() { return this.x - this._settings.background.size.width/2 - this.pivot.x }
    public get right() { return this.x + this._settings.background.size.width/2 - this.pivot.x }
    public get top() { return this.y - this._settings.background.size.height/2 - this.pivot.y }
    public get bottom() { return this.y + this._settings.background.size.height/2 - this.pivot.y }
            

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
            if (!item.isStashed.value) { item.update(container)}
        })
    }

    public resize(width: number, height: number)
    {
        this.position.set(-width/2 + 20, -20 + height/2)
        this.moveStashedItems();
    }

    public addToBackpack(...objects: BackpackItem[])
    {
        objects.forEach((item) =>
        {
            this._items.push(item);
            item.setBackpack(this);
            item.isStashed.onChanged(() => this.moveStashedItems())
            if (!item.parent || !this.parent){ return; }
            item.position = this.parent?.toGlobal(this.position)
        })
    }

    public stashAll()
    {
        this._items.forEach((item) => item.isStashed.value = true)
        this.moveStashedItems();
    }

    private moveStashedItems()
    {
        let startingPosition = this.position.x + this._backpackImage.width + 50;
        
        this._items.forEach((item) => 
        {  
            item.zIndex = item.isStashed.value ? this.zIndex + 1 : 0;

            if (!item.parent || !item.isStashed.value){ return; }
            item.position.set(startingPosition, this.position.y - 60 );
            item.speed = { x: 0, y: 0 }
            startingPosition += item.width;
        })
    }

    private createElements()
    {
        const { backpackAsset, background } = this._settings
        this._backpackImage = new Sprite({texture: Texture.from(backpackAsset), scale: 0.09});
        this._backpackImage.position.set(-background.size.width/2, -background.size.height/2)
        this._backpackImage.eventMode = "static";
        this._backpackImage.cursor = "pointer"
        this._backpackImage.on("click", () => this.stashAll());
        this.addChild(this._background, this._backpackImage)
        this._background.roundRect(-background.size.width/2, -background.size.height/2, background.size.width, background.size.height, background.radius).fill(background.color ?? "#ffffffbb")
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
    anchor: { x: 0, y: 1 },
    background:
    {
        size: { width: 500, height: 100 },
        radius: 20
    }
}