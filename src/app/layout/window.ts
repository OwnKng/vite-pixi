import { Container, Sprite, TextStyle, Text } from "pixi.js"
import { backgroundRect, lightTextStyles } from "./utils"
import { createTileset, loadCoreAssets } from "../loaders/assets"
import { createButton } from "./button"

type WindowProps = {
  title: string
  close: (props: any) => void
}

export const createLargeWindow = async ({ title, close }: WindowProps) => {
  const container = new Container()
  container.x = 0
  container.y = 0

  const background = new Container()
  background.addChild(backgroundRect.clone())
  background.alpha = 0.5
  background.eventMode = "static"
  background.on("pointerdown", close)

  container.addChild(background)

  // Window container
  const windowContainer = new Container()
  windowContainer.x = 16
  windowContainer.y = 32
  windowContainer.eventMode = "static"
  container.addChild(windowContainer)

  const { windowLarge, closeButtonTexture } = await loadCoreAssets()
  windowLarge.source.scaleMode = "nearest"
  closeButtonTexture.source.scaleMode = "nearest"

  const sprite = Sprite.from(windowLarge)
  windowContainer.addChild(sprite)

  //_ Text
  const text = new Text({
    text: title,
    style: new TextStyle({
      ...lightTextStyles,
      fontSize: 48,
    }),
  })

  text.scale = 0.15
  text.x = 4
  text.y = 15 - text.height

  windowContainer.addChild(text)

  //_ Close button
  const [closeTexture, closeHoveredTexture] = createTileset(
    closeButtonTexture,
    14,
    14
  )

  const closeButton = createButton({
    buttonText: "",
    onclick: close,
    texture: closeTexture.texture,
    hoverTexture: closeHoveredTexture.texture,
  })

  closeButton.x = windowContainer.width - closeButton.width - 2
  closeButton.y = 2

  windowContainer.addChild(closeButton)

  //_Content area
  const contentArea = new Container()
  contentArea.y = 16
  windowContainer.addChild(contentArea)

  return {
    container,
    windowContainer: windowContainer,
    contentArea,
  }
}
