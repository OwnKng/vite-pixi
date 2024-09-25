import { Container, Sprite, Text, TextStyle } from "pixi.js"
import { EntityUI } from "./types"
import { loadPipelineAssets } from "../loaders/assets"

export const createPipelineUi = async (): Promise<EntityUI> => {
  const { pipelineBackground } = await loadPipelineAssets()

  pipelineBackground.source.scaleMode = "nearest"
  const pipelineSprite = Sprite.from(pipelineBackground)
  pipelineSprite.y = 16

  const container = new Container()
  container.visible = false

  const textStyles = new TextStyle({
    fontSize: 48,
    fill: 0xfffffe,
    textBaseline: "bottom",
  })

  const title = new Text({
    text: "Pipeline",
    style: textStyles,
  })

  title.y = 8
  title.scale = 0.125

  container.addChild(title)

  const constructionContainer = new Container()
  constructionContainer.y = 16
  container.addChild(pipelineSprite)

  container.addChild(constructionContainer)

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
