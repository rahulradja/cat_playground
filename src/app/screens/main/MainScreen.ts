import { FancyButton } from "@pixi/ui";
import { animate } from "motion";
import type { AnimationPlaybackControls } from "motion/react";
import type { ContainerOptions, Ticker } from "pixi.js";
import { Container, FillGradient, Matrix, Sprite, Texture } from "pixi.js";

import { engine } from "../../getEngine";
import { PausePopup } from "../../popups/PausePopup";
import { SettingsPopup } from "../../popups/SettingsPopup";

import { Cat, CatSettings } from "./Cat.ts"
// import { Floor } from "../../displayElements/Floor.ts";
import { Background, BackgroundSettings } from "../../displayElements/Background.ts";
import { BoundedContainer } from "../../displayElements/BoundedContainer.ts";
import { CatKeyboardController } from "../../controllers/CatController.ts";
import { IdleController } from "../../controllers/IdleController.ts";
import { randomArrayElement } from "../../utils/TypeUtils.ts";

/** The screen that holds the app */
export class MainScreen extends Container  {
    /** Assets bundles required by this screen */
    public static assetBundles = ["main"];

    public mainContainer: BoundedContainer;
    public floor: Background;
    private wall: Background;
    private logo!: Sprite
    private pauseButton: FancyButton;
    private settingsButton: FancyButton;
    private cats: Cat[]=[];
    private _settings: MainScreenSettings = DefaultMainScreenSettings;
    private paused = false;
    private catColors: string[] =  ["black", "grey", "orange", "white", "kyle", "silverBengal", "snowLeopard"]

    constructor() {
        super();

        this.mainContainer = new BoundedContainer({});
        this.addChild(this.mainContainer);
        this.wall = new Background(this._settings.wall)
        this.mainContainer.addChild(this.wall)
        this.floor = new Background(this._settings.floor)
        this.mainContainer.addChild(this.floor)

        this.logo =  new Sprite({texture: Texture.from("playground-logo.png")});
        this.mainContainer.addChild(this.logo)
        this.logo.scale = 0.3

        this.createCat(true)

        this.createIdleCats(5)
        
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
        this.cats.sort((catA, catB) => catA.y -catB.y)
        this.cats.forEach((cat) => 
        {
            cat.parent?.addChildAt(cat, cat.parent.children.length -2)
            cat.update(this.floor)
        });
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
        this.wall.resize(width, height * (1 - floorFraction))
        this.wall.y = -height/2
        this.logo.x = -this.logo.width/2
        this.logo.y = height/2 - this.logo.height + 10
        this.mainContainer.addChildAt(this.logo, this.mainContainer.children.length - 1)

        this.pauseButton.x = 30;
        this.pauseButton.y = 30;
        this.settingsButton.x = width - 30
        this.settingsButton.y = 30;
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

    private getNewColor(): string
    { 
        const color = randomArrayElement(this.catColors);
        this.catColors.splice(this.catColors.indexOf(color), 1)
        return color;
    }

    private createIdleCats(catCount: number)
    {
        if (catCount >= this.catColors.length)
        {
            console.warn("too many cats for the number of colors")
        }
        for (let i=0; i<catCount; i++)
        {
            this.createCat(false, this.getNewColor())
        }
    }

    private createCat(isUserControlled: boolean = false, color: string = "babyLeo")
    {
        const controller = isUserControlled ? new CatKeyboardController() : new IdleController();
        const cat = new Cat({...this._settings.cat, color: "preload/cat/" + color}, controller)
        this.mainContainer.addChild(cat);
        cat.y += (this.cats.length % 3) * cat.height;
        cat.x += Math.floor(this.cats.length / 3) * cat.width
        this.cats.push(cat)
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
        { offset: 0, color: "#14100e" } , 
        { offset: 0.2, color: "#312722" }
    ],
    

})

const wallGradient: FillGradient = new FillGradient({type: 'linear',
    colorStops: [
        { offset: 0, color: "#d66b44" }, 
        { offset: 0.3, color: "#d4ac85" },
        { offset: 1, color: "#9b7368" },
    ]
})

export const DefaultMainScreenSettings: MainScreenSettings = 
{
    wall:
    {
        fill: wallGradient,
        pattern: 
        {
            blendMode: "multiply", 
            source: "tile_texture.jpg", 
            repeat: "repeat", 
            transform: new Matrix().scale(0.2, 0.2)
        },
    },
    floor: 
    {
        fill: floorGradient, 
        pattern: {
            source: "herringbone_texture.jpg", 
            transform: new Matrix().rotate(Math.PI/6).scale(0.6, 0.2),
            repeat: "repeat",
            blendMode: "add"
        },
        moveChildCheck: (child, newChildPos, currentSize, currentPos) => {
            const isWithinLeft = newChildPos.x - child.width/2 >= currentPos.x 
            const isWithinRight = newChildPos.x + child.width/2 <= currentSize.width + currentPos.x
            const isWithinTop = newChildPos.y + child.height/2 >= currentPos.y + 30
            const isWithinBottom = newChildPos.y + child.height/2 <= currentSize.height + currentPos.y
            return isWithinLeft && isWithinRight && isWithinBottom && isWithinTop;
        }
    },
    cat: 
    {
        desiredWidth: 150,
        color: "preload/cat/orange",
        scale: 1.2,
        sleeping: "cat_sleep.svg", 
        walkingFrames: ["cat_walk.svg", "cat_walk2.svg"], 
        sitting: "cat_sit.svg", 
        walkingSpeed: 3
    }
}