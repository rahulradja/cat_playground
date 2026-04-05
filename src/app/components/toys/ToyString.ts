import { BoundedContainer } from "../../displayElements/BoundedContainer";
import { BackpackItem, BackpackItemSettings } from "../backpack/BackpackItem";
import * as PIXI from "pixi.js"
import { RodSection } from "../physicsObjects/RodSection";
import * as VECTOR from "../../utils/Vector"

/** String like the kind you can tie - NOT string like the type (I couldn't think of a better way to name this)*/
export class ToyString<TSettings extends StringSettings = StringSettings> extends BackpackItem<StringSettings>
{
    protected _startPosition: VECTOR.Position = { x: 0, y: 0}
    protected _rodSections: RodSection[] = []
    protected get graphics()
    {
        return this._object as PIXI.Graphics
    }

    constructor(public settings: TSettings)
    {
        super(settings)
        const r = settings.sectionLength
        for (let i=0; i< settings.sectionCount; i++)
        {
            const rodSection = new RodSection(r, {x: 0, y: i*r}, {x: 0, y: (i+1) * r}, settings.sectionGravity);
            this._rodSections.push(rodSection)
        }
    }

    public update(container: BoundedContainer)
    {
        super.update(container)
        this.updateStartPos();
        this._rodSections.forEach((section) => section.update())
        this.drawUpdate();
    }

    public isIntersecting(otherObject: BoundedContainer): boolean
    {
        if (!this.parent) { return false; }
        const startPos = this.parent.toLocal(this.toGlobal(this._startPosition))
        const result = otherObject.right >= startPos.x && otherObject.left <= startPos.x
            && otherObject.bottom >=startPos.y && otherObject.top <= startPos.y
        return result;
    }

    protected handleStashed(stashed?: boolean)
    {
        super.handleStashed(stashed);
        if (!stashed) { return; }
        this.updateStartPos({x: 0, y: 0})
        this._rodSections.forEach((rod, index) => 
        {
            const startPos = index === 0 ? {x: 0, y: 0} : this._rodSections[index - 1].endPos
            rod.reset(startPos)
        })
        this.drawUpdate()
    }

    protected handleMouseMove(e: PIXI.FederatedMouseEvent)
    {
        if (!this._isDragging.value){ return; }
        this._startPosition = this.toLocal(e.global)
    }

    protected updateStartPos(startPos?: VECTOR.Position)
    {
        if (!this.parent) { return; }
        this._startPosition  = startPos ?? this._startPosition;
        this._rodSections[0].updateStartPos(this._startPosition)
        for (let i=1; i<this._rodSections.length; i++)
        {
            this._rodSections[i].updateStartPos(this._rodSections[i-1].endPos)
        }
    }

    protected drawUpdate()
    {
        this.graphics.clear();
        this.graphics.moveTo(this._rodSections[0].startPos.x, this._rodSections[0].startPos.y)
            .lineTo(this._rodSections[0].endPos.x, this._rodSections[0].endPos.y)

        for (let i=1; i<this._rodSections.length; i++)
        {
            this.graphics.lineTo(this._rodSections[i].endPos.x, this._rodSections[i].endPos.y)
                .stroke(this.settings.stroke)
        }
    }

    protected drawObject()
    {       
        const object = new PIXI.Graphics();   
        this.addChild(object)
        this._object = object       
    }
}

export interface StringSettings extends BackpackItemSettings
{
    sectionGravity?: number
    /** how many subdivisions of the string are there */
    sectionCount: number;
    /** hos long is each subdivision */
    sectionLength: number;
    stroke: PIXI.StrokeInput
}