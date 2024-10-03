import { Container, Sprite, Text, TextStyle } from "pixi.js"
import { loadCoreAssets } from "../loaders/assets"
import { lightTextStyles } from "./utils"

export const createPlayerDetails = async ({
  name,
  sprite,
}: {
  name: string
  sprite: Sprite
}) => {
  const container = new Container()

  const { playerDetailsTexture } = await loadCoreAssets()
  playerDetailsTexture.source.scaleMode = "nearest"

  const playerDetailsSprite = Sprite.from(playerDetailsTexture.source)

  container.addChild(playerDetailsSprite)

  const nameText = new Text({
    text: name,
    style: new TextStyle({ ...lightTextStyles }),
  })

  nameText.scale = 0.05
  nameText.position.set(3, 56 - nameText.height / 2)
  container.addChild(nameText)

  container.addChild(sprite)
  sprite.position.set(24, 24)

  return {
    container,
  }
}
