import { Sprite, Texture } from "pixi.js";

import {
    randomBool,
    randomFloat,
    randomInt,
} from "../../../engine/utils/random";

export enum DIRECTION {
    N,
    E,
    S,
    W,
}

export class User extends Sprite {
    public direction!: DIRECTION;
    public speed!: number;

    private yMin = -400;
    private yMax = 400;
    private xMin = -400;
    private xMax = 400;

    get left() {
        return -this.width * 0.5;
    }

    get right() {
        return this.width * 0.5;
    }

    get top() {
        return -this.height * 0.5;
    }

    get bottom() {
        return this.height * 0.5;
    }

    constructor() {
        const tex = randomBool() ? "logo.svg" : "logo-white.svg";
        super({ texture: Texture.from(tex), anchor: 0.5, scale: 0.25 });
        this.direction = randomInt(0, 3);
        this.speed = randomFloat(1, 6);
        window.addEventListener("keydown", (e) => {
            switch (e.key) {
            case "ArrowUp":
                this.direction = DIRECTION.N;
                break;
            case "ArrowDown":
                this.direction = DIRECTION.S;
                break;
            case "ArrowLeft":
                this.direction = DIRECTION.W;
                break;
            case "ArrowRight":
                this.direction = DIRECTION.E;
                break;
            }
            console.log(DIRECTION[this.direction]);
        });
    }

    public update(): void {
        this.setDirection();
    }

    public resize(w: number, h: number): void {
        this.xMin = -w / 2;
        this.xMax = w / 2;
        this.yMin = -h / 2;
        this.yMax = h / 2;
    }

    private setDirection(): void {
        switch (this.direction) {
        case DIRECTION.N:
            if (this.position.y + this.top >= this.yMin) {
                this.y -= this.speed;
            }
            break;
        case DIRECTION.E:
            if (this.position.x + this.right <= this.xMax) {
                this.x += this.speed;
            }
            break;
        case DIRECTION.S:
            if (this.position.y + this.bottom <= this.yMax) {
                this.y += this.speed;
            }
            break;
        case DIRECTION.W:
            if (this.position.x + this.left >= this.xMin) {
                this.x -= this.speed;
            }
            break;
        }
    }
}
