import { KeyState } from "./KeyState";

export class KeyboardInput
{
    public trackedKeys: KeyState[] = []

    public get pressedKeys(): string[]
    {
        return this.trackedKeys.filter((key) => key.isKeyPressed).map((keyState) => keyState.keyCode)
    }

    public isKeyPressed(keyCode: string): boolean | null
    {
        const keyState = this.getKeyState(keyCode);
        if (!keyState){ return null; }
        return keyState.isKeyPressed;
    }

    public trackKey(keyCode: string)
    {
        const existingKeyState = this.getKeyState(keyCode);
        if (existingKeyState){ return; }
        const newKeyState = new KeyState(keyCode);
        this.trackedKeys.push(newKeyState)
    }

    public untrackKey(keyCode: string)
    {
        this.trackedKeys = this.trackedKeys.filter((key) => key.keyCode !== keyCode)
    }

    public getKeyState(keyCode: string): KeyState | undefined
    {
        return this.trackedKeys.find((key) => key.keyCode === keyCode);
    }


}