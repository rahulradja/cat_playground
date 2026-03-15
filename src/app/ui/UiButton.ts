import { UIBox, UIBoxSettings } from "./UIBox"
import { ButtonOptions } from "@pixi/ui"
import { Label } from "./Label"

export const BoxButtonSettings: UIBoxSettings =
{ 
    radius: 50, 
    primaryColor: '#a5c6eb', 
    border: { color: '#26265f', width: 10 }, 
    secondaryColor: '#575dd6', 
    size: { w: 300, h: 100 },
    backingOffset: { x: 5, y: 5 },
    graphicsPosition: { x: 5, y: 0 }
}

export const defaultUIButtonSettings = (text: string): ButtonOptions =>
    ({
        defaultView: new UIBox(BoxButtonSettings),
        anchor: 0.5,
        text: new Label({
            text,
            style: {
                fill: 0x4a4a4a,
                align: "center",
                fontSize: 28,
            },
        }),
        textOffset: { x: 0, y: -13 },
        defaultTextAnchor: 0.5,
        scale: 0.9,
        animations: {
            hover: {
                props: {
                    scale: { x: 1.03, y: 1.03 },
                    y: 0,
                },
                duration: 100,
            },
            pressed: {
                props: {
                    scale: { x: 0.97, y: 0.97 },
                    y: 10,
                },
                duration: 100,
            },
        },

    })