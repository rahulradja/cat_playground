import { ObservablePoint } from "pixi.js";
import { Cat } from "../components/Cat";
import { CatBed } from "../components/furniture/CatBed";
import { IInteractionHandler, InteractionContext } from "./IInteraction";
import { waitFor } from "../../engine/utils/waitFor";

export class CatBedInteraction implements IInteractionHandler<Cat, CatBed>
{
    private _originalCatScale!: ObservablePoint;
    private cat: Cat;
    private catBed: CatBed
    constructor(objA: Cat, objB: CatBed, public interactionContext: InteractionContext)
    { 
        this.cat = objA;
        this.catBed = objB
    }
    
    public async startInteraction()
    {
        if (this.catBed.isOccupied)
        {
            this.cat.stop();
            return; 
        }
        this.cat.parent?.removeChild(this.cat);
        this.catBed.addChild(this.cat)
        this.catBed.cat = this.cat;
        this.cat.setIsInBed(true)
        this.cat.zIndex = 0;
        this.cat.position.set(this.catBed.width, this.catBed.height/2)
        this._originalCatScale = this.cat.scale;
        this.cat.scale.x = this.cat.scale.x/this.catBed.scale.x;
        this.cat.scale.y = this.cat.scale.y/this.catBed.scale.y;
        await this.waitForInteractionEnd()
    }

    public async waitForInteractionEnd(): Promise<void> {
        if (this.cat.isUserControlled)
        {
            const promise = new Promise<void>((resolve) => this.cat.onKeyPressed?.once(() => resolve()))
            await promise;
        }
        else 
        { 
            await waitFor(5);
        }
        this.stopInteraction();
    }

    public async stopInteraction()
    {
        this.cat.parent?.removeChild(this.cat);
        this.catBed.cat = null;
        this.cat.setIsInBed(false)
        this.interactionContext.playground.addChild(this.cat)
        this.cat.position.set(this.catBed.position.x, this.catBed.position.y + 100)
        this.cat.scale.x = this._originalCatScale.x * this.catBed.scale.x;
        this.cat.scale.y = this._originalCatScale.y * this.catBed.scale.y;
    }
}