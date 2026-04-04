import type { Ticker } from "pixi.js";
import { FillGradient, Matrix } from "pixi.js";

import { Cat, CatSettings } from "../components/Cat.ts"
// import { Floor } from "../../displayElements/Floor.ts";
import { Background, BackgroundSettings } from "../displayElements/Background.ts";
import { BoundedContainer } from "../displayElements/BoundedContainer.ts";
import { CatKeyboardController } from "../controllers/catControllers/CatController.ts";
import { IdleController } from "../controllers/catControllers/IdleController.ts";
import { randomArrayElement } from "../utils/TypeUtils.ts";
import { Ball, BallSettings } from "../components/toys/Ball.ts";
import { Backpack, BackpackSettings, defaultBackpackSettings } from "../components/backpack/Backpack.ts";
import { CollisionEngine } from "../controllers/physics/CollisionEngine.ts";
import { ContainerSettings } from "../displayElements/ResizableContainer.ts";
import { BallVertical, BallVerticalSettings } from "../components/toys/BallVertical.ts";
import { CatWand, CatWandSettings } from "../components/toys/CatWand.ts";
import { BackpackItem } from "../components/backpack/BackpackItem.ts";

/** The screen that holds the app */
export class Playground extends BoundedContainer<PlaygroundSettings>  
{
    /** Assets bundles required by this screen */
    public static assetBundles = ["main"];

    public floor: Background;
    protected _settings: PlaygroundSettings = DefaultPlaygroundSettings;
    private items: BackpackItem[] = [];
    private backpack!: Backpack;
    private cats: Cat[]=[];
    private collisionEngine: CollisionEngine = new CollisionEngine();
    private paused = false;
    private catColors: string[] =  ["black", "grey", "orange", "white", "kyle", "silverBengal", "snowLeopard"]

    constructor(_settings: PlaygroundSettings) {
        super(_settings);
        this.floor = new Background(this._settings.floor)
        this.addChild(this.floor)

        this.createCat(true)

        this.createIdleCats(5)

        this.backpack = new Backpack(this._settings.backpack);
        this.addChild(this.backpack)
        this._settings.balls.forEach((ball) => this.createBall(ball));
        this.createString();
    }

    /** Prepare the screen just before showing */
    public prepare() {}

    /** Update the screen */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public update(_time: Ticker) {
        if (this.paused) return;
        const sortableObjects =  [...this.cats, ...this.backpack.items ]
        sortableObjects.sort((catA, catB) => catA.bottom - catB.bottom)
        sortableObjects.forEach((cat) => 
        {
            cat.parent?.addChildAt(cat, cat.parent.children.length - 1)
        });
        this.cats.forEach((cat) => cat.update(this.floor))
        this.backpack.updateItems(this.floor)
        this.collisionEngine.update();
    }

    /** Pause gameplay - automatically fired when a popup is presented */
    public async pause() {
        this.interactiveChildren = false;
        this.paused = true;
    }

    /** Resume gameplay */
    public async resume() {
        this.interactiveChildren = true;
        this.paused = false;
    }

    /** Fully reset */
    public reset() {}

    /** Resize the screen, fired whenever window size changes */
    public resize(width: number, height: number) {
        const centerX = width * 0.5;
        const centerY = height * 0.5;

        this.position.set(centerX, centerY);
        const floorFraction = 0.65
        this.floor.resize(width, height * floorFraction)
        this.floor.position.set(0, height/2)
        this.backpack.zIndex = 2;
        this.backpack.resize(width, height);
    }

    private createBall(settings: BallSettings): Ball
    {
        const ball = new BallVertical(settings)
        this.addChild(ball)
        this.backpack.addToBackpack(ball);
        this.collisionEngine.startTracking(ball);
        this.items.push(ball)
        return ball
    }

    private createString(): CatWand
    {
        const ball = new CatWand(this._settings.catWand)
        this.addChild(ball)
        this.backpack.addToBackpack(ball);
        this.collisionEngine.startTracking(ball);
        this.items.push(ball)
        return ball
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
        this.addChild(cat);
        this.collisionEngine.startTracking(cat)
        cat.y += (this.cats.length % 3) * cat.height;
        cat.x += Math.floor(this.cats.length / 3) * cat.width
        this.cats.push(cat)
    }
}

export interface PlaygroundSettings extends ContainerSettings
{
    cat: CatSettings;
    floor: BackgroundSettings;
    balls: BallVerticalSettings[];
    backpack: BackpackSettings;
    catWand: CatWandSettings;
}

const floorGradient: FillGradient = new FillGradient({
    type: 'linear',
    colorStops: 
    [
        { offset: 0, color: "#14100e" } , 
        { offset: 0.2, color: "#312722" }
    ],
})

export const DefaultPlaygroundSettings: PlaygroundSettings = 
{
    backpack: defaultBackpackSettings,
    catWand:
    {
        sectionCount: 20,  
        sectionLength: 10, 
        stroke:{ color: "#6b1000", width: 5 }, 
        rod: { color: "#291d19", width: 10 }
    },
    balls:
    [
        {
            radius: 25,
            color: "#ff7979",
            asset: "yarn.png",
            restitution: 0.5,
            friction: 0.96,
            weight: 0.5
        },
        {
            weight: 0.2,
            radius: 15,
            color: "#ff7979",
            friction: 0.99,
            pickUpHeight: 250
        }
    ],
    floor: 
    {
        fill: floorGradient, 
        anchor: { x: 0.5, y: 1 },
        pattern: {
            source: "herringbone_texture.jpg", 
            transform: new Matrix().rotate(Math.PI/6).scale(0.6, 0.2),
            repeat: "repeat",
            blendMode: "add"
        },
    },
    cat: 
    {
        desiredWidth: 150,
        color: "preload/cat/orange",
        scale: 0.8,
        sleeping: "cat_sleep.svg", 
        walkingFrames: ["cat_walk.svg", "cat_walk2.svg"], 
        sitting: "cat_sit.svg", 
        walkingSpeed: 3
    }
}