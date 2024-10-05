import { Container, Graphics, TextStyle, Text } from "pixi.js"
import { lightTextStyles } from "./utils"

const SCALE_FACTOR = 15

export const createScrollingTextContainer = ({
  text,
  width,
  height,
  margin = { top: 4, right: 4, bottom: 4, left: 4 },
}: {
  text: string
  width: number
  height: number
  margin?: { top: number; right: number; bottom: number; left: number }
}) => {
  let isOver = false

  const container = new Container()
  container.eventMode = "static"

  const mask = new Graphics().rect(0, 0, width, height).fill(0xffffff)

  container.addChild(mask)
  container.mask = mask

  // Add Text
  const textGraphics = new Text({
    text: text,
    style: new TextStyle({
      ...lightTextStyles,
      wordWrap: true,
      align: "left",
    }),
  })

  textGraphics.scale = 1 / SCALE_FACTOR
  textGraphics.style.wordWrapWidth =
    (width - margin.left - margin.right) * SCALE_FACTOR

  textGraphics.x = margin.left
  textGraphics.y = margin.top

  container.addChild(textGraphics)

  container.on("pointerover", () => {
    isOver = true
  })

  container.on("pointerout", () => {
    isOver = false
  })

  const onMouseScroll = (e: WheelEvent) => {
    if (!isOver) return
    if (textGraphics.height < height) return

    const delta = e.deltaY
    const targetPos = textGraphics.y - delta

    const min = height - textGraphics.height
    const max = 0

    textGraphics.y = Math.min(max, Math.max(min, targetPos))
  }

  document.addEventListener("wheel", onMouseScroll, true)

  container.destroy = () => {
    document.removeEventListener("wheel", onMouseScroll, true)
  }

  return {
    addToParent: (parent: Container) => parent.addChild(container),
  }
}
