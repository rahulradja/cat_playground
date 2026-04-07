import { FancyButton } from "@pixi/ui";
import { animate } from "motion";
import type { AnimationPlaybackControls } from "motion/react";
import type { ContainerOptions, Ticker } from "pixi.js";
import { Container, FillGradient, Matrix, Sprite, Texture } from "pixi.js";

import { engine } from "../getEngine.ts";
import { PausePopup } from "../popups/PausePopup.ts";
import { SettingsPopup } from "../popups/SettingsPopup.ts";
import { Background, BackgroundSettings } from "../displayElements/Background.ts";
import { DefaultPlaygroundSettings, Playground, PlaygroundSettings } from "./Playground.ts";
import { defaultOnScreenInput, OnScreenInput } from "../controllers/input/OnScreenInput.ts";

/** The screen that holds the app */
export class MainScreen extends Container  {
    /** Assets bundles required by this screen */
    public static assetBundles = ["main"];

    private _playground!: Playground;
    private wall: Background;
    private logo!: Sprite;
    private pauseButton: FancyButton;
    private settingsButton: FancyButton;
    private _settings: MainScreenSettings = DefaultMainScreenSettings;
    private paused = false;
    private _onScreenInput: OnScreenInput;
    constructor() {
        super();

        this._onScreenInput = new OnScreenInput(defaultOnScreenInput)
        this.addChild(this._onScreenInput)
        this._playground = new Playground(this._settings.playground, this._onScreenInput);
        this.addChild(this._playground);
        this.wall = new Background(this._settings.wall)
        this.addChild(this.wall)


        this.logo =  new Sprite({texture: Texture.from("playground-logo.png")});
        this.logo.zIndex = 4
        this._playground.addChild(this.logo)
        this.logo.scale = 0.3;
        
        const buttonAnimations = {
            hover: {
                props: {
                    scale: { x: 1.1, y: 1.1 },
                },
                duration: 100,
            },
            pressed: {
                props: {
                    scale: { x: 0.9, y: 0.9 },
                },
                duration: 100,
            },
        };
        this.pauseButton = new FancyButton({
            defaultView: "icon-pause.png",
            anchor: 0.5,
            animations: buttonAnimations,
        });
        this.pauseButton.onPress.connect(() =>
            engine().navigation.presentPopup(PausePopup),
        );
        this.addChild(this.pauseButton);

        this.settingsButton = new FancyButton({
            defaultView: "icon-settings.png",
            anchor: 0.5,
            animations: buttonAnimations,
        });
        this.settingsButton.onPress.connect(() =>
            engine().navigation.presentPopup(SettingsPopup),
        );
        // this.addChild(this.settingsButton);
    }

    /** Prepare the screen just before showing */
    public prepare() {}

    /** Update the screen */
     
    public update(_time: Ticker) {
        if (this.paused) {return};
        this._playground.update(_time);
    }

    /** Pause gameplay - automatically fired when a popup is presented */
    public async pause() {
        this._playground.interactiveChildren = false;
        this.paused = true;
    }

    /** Resume gameplay */
    public async resume() {
        this._playground.interactiveChildren = true;
        this.paused = false;
    }

    /** Fully reset */
    public reset() {}

    /** Resize the screen, fired whenever window size changes */
    public resize(width: number, height: number) {
        const centerX = width * 0.5;
        const centerY = height * 0.5;

        this._playground.position.set(centerX, centerY);
        const floorFraction = 0.65
        this.wall.resize(width, height * (1 - floorFraction))
        this.wall.position.set(width/2, 0)
        const maxLogoSize = Math.min(400, width/4);
        const newLogoScale = maxLogoSize/this.logo.width
        this.logo.scale = this.logo.scale.x * newLogoScale;
        this._onScreenInput.scale = this._onScreenInput.scale.x * newLogoScale
        this.logo.position.set(width/2 - this.logo.width - 10, height/2 - this.logo.height + 10);
        this.pauseButton.position.set(30, 30);
        this.settingsButton.position.set(width - 30, 30);
        this._playground.resize(width, height)
        this._onScreenInput.position.set(width - this._onScreenInput.width/2 - 20, height/2)
    }

    /** Show screen with animations */
    public async show(): Promise<void> {

        const elementsToAnimate = [
            this.pauseButton,
            this.settingsButton,
        ];

        let finalPromise!: AnimationPlaybackControls;
        for (const element of elementsToAnimate) {
            element.alpha = 0;
            finalPromise = animate(
                element,
                { alpha: 1 },
                { duration: 0.3, delay: 0.75, ease: "backOut" },
            );
        }

        await finalPromise;
    }

    /** Hide screen with animations */
    public async hide() {}

    /** Auto pause the app when window go out of focus */
    public blur() {
        if (!engine().navigation.currentPopup) {
            engine().navigation.presentPopup(PausePopup);
        }
    }
}

export interface MainScreenSettings extends ContainerOptions
{
    wall: BackgroundSettings;
    playground: PlaygroundSettings;
}

const wallGradient: FillGradient = new FillGradient({type: 'linear',
    colorStops: [
        { offset: 0, color: "#f8c1bb" }, 
        { offset: 0.3, color: "#e79898" },
        { offset: 1, color: "#c8806c" },
    ]
})

export const DefaultMainScreenSettings: MainScreenSettings = 
{
    wall:
    {
        anchor: { x: 0.5, y: 0 },
        zIndex: -1,
        fill: wallGradient,
        pattern: 
        {
            blendMode: "multiply", 
            source: "tile_texture.jpg", 
            repeat: "repeat", 
            transform: new Matrix().scale(0.2, 0.2)
        }
    },
    playground: DefaultPlaygroundSettings
}