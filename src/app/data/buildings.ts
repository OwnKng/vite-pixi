import { Sprite } from "pixi.js"
import { Assets } from "pixi.js"

// Load the bunny texture
const texture = await Assets.load("https://pixijs.com/assets/bunny.png")

export const constructions = {
  "City wall": {
    name: "City wall",
    cost: 100,
    level: 1,
    sprite: new Sprite(texture),
  },
}
