import { Container, Sprite, TextStyle, Text } from "pixi.js"
import { backgroundRect, lightTextStyles } from "./utils"
import { createTileset, loadCoreAssets } from "../loaders/assets"
import { createButton } from "./button"
import { Texture } from "pixi.js"
import { dims } from "../consts"

export type WindowUi = {
  container: Container
  windowContainer: Container
  contentArea: Container
}

type WindowProps = {
  title: string
  close: (props: any) => void
}

interface CreateWindowArgs extends WindowProps {
  size: "small" | "large"
}

interface GenericWindowProps extends WindowProps {
  texture: Texture
}

export const createWindow = async ({
  title,
  close,
  size,
}: CreateWindowArgs): Promise<WindowUi> => {
  const { windowLarge, windowSmall } = await loadCoreAssets()
  windowLarge.source.scaleMode = "nearest"
  windowSmall.source.scaleMode = "nearest"

  const map = {
    large: async ({ title, close }: WindowProps) =>
      await createWindowContainer({ title, close, texture: windowLarge }),
    small: async ({ title, close }: WindowProps) =>
      await createWindowContainer({ title, close, texture: windowSmall }),
  }

  return await map[size]({ title, close })
}

const createWindowContainer = async ({
  texture,
  title,
  close,
}: GenericWindowProps): Promise<WindowUi> => {
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

  windowContainer.eventMode = "static"
  container.addChild(windowContainer)

  const sprite = Sprite.from(texture)
  windowContainer.addChild(sprite)

  windowContainer.x = dims.width / 2 - windowContainer.width / 2
  windowContainer.y = 32

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
  const { closeButtonTexture } = await loadCoreAssets()
  closeButtonTexture.source.scaleMode = "nearest"

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
    container: container,
    windowContainer: windowContainer,
    contentArea,
  }
}
