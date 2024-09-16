import { Application, Container, Ticker } from "pixi.js"
import { dims } from "./consts"
import { gameScreen } from "./gamescreen"

export default function createApplication() {
  const app = new Application()

  const gameContainer = new Container()
  app.stage.addChild(gameContainer)

  const setPlay = async () => {
    await gameScreen.init()

    gameContainer.addChild(gameScreen.container)
  }

  Ticker.shared.add((time) => {
    if (app.renderer) {
      gameContainer.scale.set(
        app.renderer.width / dims.width,
        app.renderer.height / dims.height
      )
    }
  })

  return {
    app,
    setPlay,
  }
}
