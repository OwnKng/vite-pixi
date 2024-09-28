import { Container, Graphics } from "pixi.js"

export const createEndTurnButton = () => {
  const container = new Container()

  const rect = new Graphics().roundRect(0, 0, 48, 16, 2).fill(0xffffff)
  container.addChild(rect)
  container.eventMode = "static"

  const addToWorld = (parent: Container) => parent.addChild(container)

  return {
    container,
    addToWorld,
  }
}
