import { Container, Sprite, Ticker } from "pixi.js"
import { loadCoreAssets, loadPlayingAssets } from "../loaders/assets"
import { dims, CITIES, zIndexLevels } from "../consts"
import {
  createCityEntity,
  createPipeline,
  createPlayerEntity,
} from "../entities"
import { createGrid } from "../layout/grid"
import { queries } from "../entities"
import { announcements } from "../layout/announcements"
import { updatePipelineUi, turnSystem, scoreboardSystem } from "../systems"
import { createButton } from "../layout/button"
import { createSidebar } from "../layout/sidebar"

export function createGameScreen() {
  let gamescreen = new Container()
  gamescreen.zIndex = zIndexLevels.low

  const overlay = new Container()
  overlay.zIndex = zIndexLevels.high
  gamescreen.addChild(overlay)

  async function init() {
    // Cards
    const cards = await createGrid({
      width: 304,
      height: 80,
      gap: 4,
      scrollOffset: 0,
    })

    cards.container.position.y = 96
    cards.container.position.x = 8
    gamescreen.addChild(cards.container)

    //_ Sidebar
    const { container, buttons } = await createSidebar()
    container.position.set(dims.width - 24, 8)

    const [
      menuButton,
      analysisButton,
      notificationButton,
      mapButton,
      turnButton,
    ] = buttons

    gamescreen.addChild(container)

    turnButton.on("click", () => {
      for (const player of queries.player) {
        player.readyForNext = true
        cards.resetView()
      }
    })

    //_ Player
    const player = createPlayerEntity()
    player.scoreboard.addToWorld(gamescreen)

    const pipeline = await createPipeline()
    pipeline.ui.addToWorld(gamescreen, 0, 0)
    pipeline.ui.show()

    //_ Cities
    CITIES.forEach(async (city) => {
      const cityEntity = await createCityEntity(city)

      cityEntity.card.container.on("pointerdown", () => cityEntity.view.show())

      cards.addItem(cityEntity.card.container)
      overlay.addChild(cityEntity.view.container)
    })

    //_ Announcements
    announcements.addToWorld(gamescreen)
  }

  Ticker.shared.add(() => {
    updatePipelineUi()
    scoreboardSystem()
    turnSystem(overlay)
  })

  return {
    init,
    container: gamescreen,
  }
}
