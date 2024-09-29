import { Application, Container, Ticker } from "pixi.js"
import { dims } from "./consts"
import { createGameScreen, createTitleScreen } from "./screens"
import { loadFonts } from "./loaders/assets"

export default function createApplication() {
  const app = new Application()

  let loading = false

  const gameScreen = createGameScreen()

  const gameContainer = new Container()
  app.stage.addChild(gameContainer)

  const loadCoreAssets = async () => {
    await loadFonts()
  }

  const startGame = async () => {
    const titleScreen = await createTitleScreen(startNewRound)
    gameContainer.addChild(titleScreen.container)
  }

  const startNewRound = async () => {
    gameContainer.removeChildren()
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
    loadCoreAssets,
    startGame,
  }
}
