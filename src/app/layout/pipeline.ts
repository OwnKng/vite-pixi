import { Container, Text } from "pixi.js"
import { EntityUI } from "./types"

export const createPipelineUi = (): EntityUI => {
  const container = new Container()
  container.visible = false

  const title = new Text({
    text: "Pipeline",
    style: { fontSize: 48, fill: 0xfffffe },
  })

  title.x = 2
  title.y = 2
  title.scale = 0.125

  container.addChild(title)

  const constructionContainer = new Container()
  constructionContainer.y = 64
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
