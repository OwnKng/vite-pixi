import { Container, Graphics } from "pixi.js"

export const createEndTurnButton = () => {
  const container = new Container()

  const rect = new Graphics().rect(0, 0, 64, 64).fill(0xffffff)
  container.addChild(rect)
  container.eventMode = "static"

  const addToWorld = (parent: Container) => parent.addChild(container)

  return {
    container,
    addToWorld,
  }
}
