import { CircularProgressBar } from "@pixi/ui";
import { animate } from "motion";
import type { ObjectTarget } from "motion/react";
import { AnimatedSprite, Container, Sprite, Texture } from "pixi.js";
import { Background } from "../displayElements/Background";
import { DefaultMainScreenSettings } from "./MainScreen";

/** Screen shown while loading assets */
export class LoadScreen extends Container {
    /** Assets bundles required by this screen */
    public static assetBundles = ["preload"];
    private loadingCat: AnimatedSprite;
    private logo: Sprite;
    /** Progress Bar */
    private progressBar: CircularProgressBar;
    private background: Background;

    constructor() {
        super();
        this.background = new Background(DefaultMainScreenSettings.wall)
        this.addChild(this.background)

        this.progressBar = new CircularProgressBar({
            backgroundColor: "#352121",
            fillColor: "#24000c",
            radius: 100,
            lineWidth: 15,
            value: 20,
            backgroundAlpha: 0.5,
            fillAlpha: 0.8,
            cap: "round",
        });

        this.progressBar.x += this.progressBar.width / 2;
        this.progressBar.y += -this.progressBar.height / 2;

        this.addChild(this.progressBar);

        this.loadingCat = new AnimatedSprite({
            textures: [Texture.from("preload/cat/babyLeo/cat_walk.svg"), Texture.from("preload/cat/babyLeo/cat_walk2.svg")],
            anchor: 0.5,
            scale: 0.05,
            animationSpeed: 0.05
        });
        this.loadingCat.scale.x = -this.loadingCat.scale.x
        this.addChild(this.loadingCat);
        this.loadingCat.play()
        this.logo = new Sprite({texture: Texture.from("playground-logo.png"), scale: 0.3})
        this.addChild(this.logo)
        this.logo.position.set(this.width/2, this.height - this.logo.height + 10);
    }

    public onLoad(progress: number) {
        this.progressBar.progress = progress;
    }

    /** Resize the screen, fired whenever window size changes  */
    public resize(width: number, height: number) {
        this.loadingCat.position.set(width * 0.5, height * 0.5);
        this.progressBar.position.set(width * 0.5, height * 0.5);
        this.background.resize(width, height)
        this.background.position.set(width * 0.5, 0);
        this.logo.position.set(this.width/2 - this.logo.width/2, this.height - this.logo.height + 10);
    }

    /** Show screen with animations */
    public async show() {
        this.alpha = 1;
    }

    /** Hide screen with animations */
    public async hide() {
        await animate(this, { alpha: 0 } as ObjectTarget<this>, {
            duration: 0.3,
            ease: "linear",
            delay: 1,
        });
    }
}
