export type Callback = () => {}

export class BasicEvent
{
    private _handlers: {resolve: Callback, reject?: Callback}[] = []

    public onChanged(resolve: Callback, reject?: Callback)
    {
        this._handlers.push({resolve, reject});
    }

    public fire()
    {
        this._handlers.forEach((handler) => handler.resolve())
    }
}