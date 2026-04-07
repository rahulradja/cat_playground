import { Backpack } from "../components/backpack/Backpack";
import { BoundedContainer } from "../displayElements/BoundedContainer";
import { Playground } from "../screens/Playground";

export abstract class IInteractionHandler<TTypeA extends BoundedContainer = BoundedContainer, TTypeB extends BoundedContainer = BoundedContainer>
{
    constructor(objA: TTypeA, objB: TTypeB, public interactionContext: InteractionContext){}
    public abstract startInteraction(): Promise<void>
    public abstract stopInteraction(): Promise<void>

    public abstract waitForInteractionEnd?(): Promise<void>
}

export interface InteractionContext
{
    playground: Playground;
    backpack: Backpack;
}