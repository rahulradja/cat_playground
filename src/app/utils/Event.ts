
export type Callback = () => unknown
export type ValuedCallback<T> = (val?: T) => unknown

export type EventHandler =  {resolve: Callback, reject?: Callback, once?: boolean}
export type ValuedEventHandler<T> = { resolve: ValuedCallback<T>, reject?: ValuedCallback<T>, once?: boolean }
export class BasicEvent
{
    private _handlers: EventHandler[] = []

    public on(resolve: Callback, reject?: Callback)
    {
        this._handlers.push({resolve, reject});
    }

    public once(resolve: Callback, reject?: Callback)
    {
        this._handlers.push({resolve, reject, once: true});
    }

    public clearHandlers()
    {
        this._handlers = [];
    }

    public fire()
    {
        this._handlers.forEach((handler) => handler.resolve());
        this._handlers = this._handlers.filter((handler) => !handler.once)
    }
}

export class ValuedEvent<T>
{
    private _handlers: ValuedEventHandler<T>[] = []

    public on(resolve: ValuedCallback<T>, reject?: ValuedCallback<T>)
    {
        this._handlers.push({resolve, reject});
    }

    public once(resolve: ValuedCallback<T>, reject?: ValuedCallback<T>)
    {
        this._handlers.push({resolve, reject, once: true});
    }

    public fire(val: T)
    {
        this._handlers.forEach((handler) => handler.resolve(val))
        this._handlers = this._handlers.filter((handler) => !handler.once)
    }

    public clearHandlers()
    {
        this._handlers = [];
    }
}