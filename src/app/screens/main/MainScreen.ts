import { FancyButton } from "@pixi/ui";
import { animate } from "motion";
import type { AnimationPlaybackControls } from "motion/react";
import type { ContainerOptions, Ticker } from "pixi.js";
import { Container, FillGradient } from "pixi.js";

import { engine } from "../../getEngine";
import { PausePopup } from "../../popups/PausePopup";
import { SettingsPopup } from "../../popups/SettingsPopup";

import { Cat, CatSettings } from "./Cat.ts"
// import { Floor } from "../../displayElements/Floor.ts";
import { Background, BackgroundSettings } from "../../displayElements/Background.ts";
import { BoundedContainer } from "../../displayElements/BoundedContainer.ts";
import { CatKeyboardController } from "../../controllers/CatController.ts";

/** The screen that holds the app */
export class MainScreen extends Container  {
    /** Assets bundles required by this screen */
    public static assetBundles = ["main"];

    public mainContainer: BoundedContainer;
    public floor: Background;
    private wall: Background;
    private pauseButton: FancyButton;
    private settingsButton: FancyButton;
    private cat: Cat;
    private _settings: MainScreenSettings = DefaultMainScreenSettings;
    private paused = false;

    constructor() {
        super();

        this.mainContainer = new BoundedContainer({});
        this.addChild(this.mainContainer);
        this.wall = new Background(this._settings.wall)
        this.mainContainer.addChild(this.wall)
        this.floor = new Background(this._settings.floor)
        this.mainContainer.addChild(this.floor)
        this.cat = new Cat(this._settings.cat, new CatKeyboardController())
        this.cat.y = this.cat.height/2
        this.mainContainer.addChild(this.cat);

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
        this.addChild(this.settingsButton);
    }

    /** Prepare the screen just before showing */
    public prepare() {}

    /** Update the screen */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public update(_time: Ticker) {
        if (this.paused) return;
        this.cat.update(this.floor);
    }

    /** Pause gameplay - automatically fired when a popup is presented */
    public async pause() {
        this.mainContainer.interactiveChildren = false;
        this.paused = true;
    }

    /** Resume gameplay */
    public async resume() {
        this.mainContainer.interactiveChildren = true;
        this.paused = false;
    }

    /** Fully reset */
    public reset() {}

    /** Resize the screen, fired whenever window size changes */
    public resize(width: number, height: number) {
        const centerX = width * 0.5;
        const centerY = height * 0.5;

        this.mainContainer.x = centerX;
        this.mainContainer.y = centerY;
        const floorFraction = 0.65
        this.floor.resize(width, height * floorFraction)
        this.floor.y = -height * (floorFraction - 0.5)
        this.wall.resize(width, height)

        this.pauseButton.x = 30;
        this.pauseButton.y = 30;
        this.settingsButton.x = width - 30
        this.settingsButton.y = 30;
    }

    /** Show screen with animations */
    public async show(): Promise<void> {
        engine().audio.bgm.play("main/sounds/bgm-main.mp3", { volume: 0.5 });

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
    cat: CatSettings;
    floor: BackgroundSettings;
    wall: BackgroundSettings;
}

const floorGradient: FillGradient = new FillGradient({
    type: 'linear',
    colorStops: 
    [
        { offset: 0, color: "#69564d", }, 
        { offset: 0.2, color: "#aa9f94", }  
    ],
    

})

const wallGradient: FillGradient = new FillGradient({type: 'linear',
    colorStops: [
        { offset: 0, color: "#d66b44", }, 
        { offset: 0.3, color: "#d4ac85", }  
    ]
})

export const DefaultMainScreenSettings: MainScreenSettings = 
{
    wall:
    {
        fill: wallGradient
    },
    floor: 
    {
        fill: floorGradient,
        moveChildCheck: (child, newChildPos, currentSize, currentPos) => {
            const isWithinLeft = newChildPos.x - child.width/2 >= currentPos.x 
            const isWithinRight = newChildPos.x + child.width/2 <= currentSize.width + currentPos.x
            const isWithinTop = newChildPos.y + child.height/2 >= currentPos.y
            const isWithinBottom = newChildPos.y + child.height/2 <= currentSize.height + currentPos.y
            return isWithinLeft && isWithinRight && isWithinBottom && isWithinTop;
        }
    },
    cat: 
    {
        scale: 2, 
        sleeping: "cat_sleep.svg", 
        walkingFrames: ["cat_walk.svg", "cat_walk2.svg"], 
        sitting: "cat_sit.svg", 
        walkingSpeed: 3
    }
}