import { BasicEvent } from "./Event";

export class Observable<T>
{
    private _value: T
    private _onChangedEvent: BasicEvent = new BasicEvent();
    public get value() 
    { 
        this._onChangedEvent.fire()
        return this._value; 
    }
    public set value(val: T) 
    { 
        this._onChangedEvent.fire()
        this._value = val; 
    }

    constructor(initialValue: T)
    {
        this._value = initialValue
    }
}