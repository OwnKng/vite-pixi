import { Container, Graphics, Sprite, Text, TextStyle } from "pixi.js"
import { EntityUI } from "./types"
import { loadPipelineAssets } from "../loaders/assets"
import { lightTextStyles } from "./utils"

export const createPipelineUi = async (): Promise<EntityUI> => {
  const { pipelineBackground } = await loadPipelineAssets()

  const container = new Container()

  container.visible = false

  const title = new Text({
    text: "Pipeline",
    style: new TextStyle({
      ...lightTextStyles,
      textBaseline: "bottom",
    }),
  })

  title.anchor.set(0, 1)
  title.scale = 0.0625

  container.addChild(title)

  const innerContainer = new Container()
  container.addChild(innerContainer)

  pipelineBackground.source.scaleMode = "nearest"
  const pipelineSprite = Sprite.from(pipelineBackground)

  //_ Mask
  const mask = new Graphics()
    .rect(0, 0, pipelineSprite.width, pipelineSprite.height)
    .fill(0x000000)

  innerContainer.mask = mask
  innerContainer.addChild(mask)
  innerContainer.addChild(pipelineSprite)

  const constructionContainer = new Container()
  innerContainer.addChild(constructionContainer)

  const show = () => {
    container.visible = true
  }

  const hide = () => {
    container.visible = false
  }

  const destroy = () => container.destroy()

  const addToWorld = (world: Container, x: number, y: number) => {
    world.addChild(container)
    container.position.set(x, y)
  }

  return {
    container: constructionContainer,
    show,
    hide,
    destroy,
    addToWorld,
  }
}
