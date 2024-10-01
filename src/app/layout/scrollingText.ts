import { Container, Graphics, TextStyle, Text } from "pixi.js"
import { lightTextStyles } from "./utils"

export const createScrollingTextContainer = ({
  text,
  width,
  height,
}: {
  text: string
  width: number
  height: number
}) => {
  const container = new Container()

  const mask = new Graphics().rect(0, 0, width, height).fill(0xffffff)

  container.addChild(mask)
  container.mask = mask

  // Add Text
  const textGraphics = new Text({
    text: text,
    style: new TextStyle({ ...lightTextStyles }),
  })

  textGraphics.scale = 0.1
  container.addChild(textGraphics)

  return {
    addToParent: (parent: Container) => parent.addChild(container),
  }
}
