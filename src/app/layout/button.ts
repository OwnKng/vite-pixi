import { lightTextStyles } from "./utils"
import { Container, Sprite, Text, TextStyle, Texture } from "pixi.js"

export const createButton = ({
  buttonText,
  onclick,
  texture,
  hoverTexture,
}: {
  buttonText: string
  onclick: (props: any) => void
  texture: Texture
  hoverTexture: Texture
}) => {
  const container = new Container()
  const buttonSprite = Sprite.from(texture)

  const text = new Text({
    text: buttonText,
    style: new TextStyle({
      ...lightTextStyles,
      textBaseline: "middle",
    }),
  })

  text.scale.set(0.1)
  text.x = buttonSprite.width * 0.5 - text.width * 0.5
  text.y = buttonSprite.height * 0.5 - text.height * 0.5

  container.addChild(buttonSprite)

  container.addChild(text)
  container.eventMode = "static"
  container.cursor = "pointer"
  container.on("click", onclick)

  container.on("mouseenter", () => (buttonSprite.texture = hoverTexture))
  container.on("mouseleave", () => (buttonSprite.texture = texture))

  return container
}
