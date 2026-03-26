
export type Callback = () => unknown

export class BasicEvent
{
    private _handlers: {resolve: Callback, reject?: Callback}[] = []

    public on(resolve: Callback, reject?: Callback)
    {
        this._handlers.push({resolve, reject});
    }

    public fire()
    {
        this._handlers.forEach((handler) => handler.resolve())
    }
}