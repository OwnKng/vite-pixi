import { Container, TextStyle, Text } from "pixi.js"
import { dims } from "../consts"
import { lightTextStyles } from "../layout/utils"
import { createButton } from "../layout/button"
import { loadCoreAssets } from "../loaders/assets"

export async function createTitleScreen(onStartButtonClick: () => void) {
  const container = new Container()

  const { buttonTexture, textInputTexture } = await loadCoreAssets()
  buttonTexture.source.scaleMode = "nearest"
  textInputTexture.source.scaleMode = "nearest"

  const startGame = createButton({
    buttonText: "Start Game",
    texture: buttonTexture,
    hoverTexture: buttonTexture,
    onclick: onStartButtonClick,
  })

  startGame.position.set(
    dims.width / 2 - startGame.width / 2,
    dims.height - startGame.height - 32
  )

  const title = new Text({
    text: "City Manager",
    style: new TextStyle({ ...lightTextStyles }),
  })

  title.scale = 0.25
  title.x = dims.width / 2 - title.width / 2
  title.y = dims.height / 2 - title.height / 2

  container.addChild(title)
  container.addChild(startGame)

  return {
    container,
  }
}
