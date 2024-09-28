import { Graphics, TextStyle } from "pixi.js"
import { dims } from "../consts"

const backgroundRect = new Graphics()
  .rect(0, 0, dims.width, dims.height)
  .fill(0x000000)

export { backgroundRect }

export const lightTextStyles = {
  fill: 0xffffff,
  fontSize: 96,
  dropShadow: true,
  dropShadowColor: 0x000000,
  verticalAlign: "middle",
  align: "center",
  fontFamily: "Pixelify Sans",
}

export const darkTextStyles = {
  ...lightTextStyles,
  fill: 0x000000,
  dropShadowColor: 0xffffff,
}
