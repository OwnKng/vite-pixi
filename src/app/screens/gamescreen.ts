import { Container, Ticker } from "pixi.js"
import { dims, CITIES, zIndexLevels } from "../consts"
import {
  createCityEntity,
  createPipeline,
  createPlayerEntity,
} from "../entities"
import { createGrid } from "../layout/grid"
import { queries } from "../entities"
import { announcements } from "../layout/announcements"
import {
  updatePipelineUi,
  turnSystem,
  scoreboardSystem,
  
} from "../systems"
import { createSidebar } from "../layout/sidebar"
import { createPlayerDetails } from "../layout/playerDetails"
import { createCharacterSprites } from "../layout/characters"
import { createAnalysisWindow } from "../layout/analysis"
import { createMissionsUi } from "../layout/missions"

export function createGameScreen() {
  let gamescreen = new Container()
  gamescreen.zIndex = zIndexLevels.low

  const overlay = new Container()
  overlay.zIndex = zIndexLevels.high
  gamescreen.addChild(overlay)

  async function init() {
    //_Cards
    const cards = await createGrid({
      width: 304,
      height: 80,
      gap: 4,
      scrollOffset: 0,
    })

    cards.container.position.y = 96
    cards.container.position.x = 8
    gamescreen.addChild(cards.container)

    //_ Player
    const { character } = await createCharacterSprites()
    const player = await createPlayerEntity(
      "Player",
      character,
      1000,
      CITIES.reduce((acc, city) => acc + city.population, 0),
      CITIES.reduce((acc, city) => acc + city.soldiers, 0)
    )
    player.scoreboard.container.position.set(64, 16)
    player.scoreboard.addToWorld(gamescreen)

    const pipeline = await createPipeline()
    pipeline.ui.addToWorld(gamescreen, 224, 16)
    pipeline.ui.show()

    const playerDetails = await createPlayerDetails({
      name: player.name,
      sprite: player.sprite,
    })

    playerDetails.container.position.set(8, 16)
    gamescreen.addChild(playerDetails.container)

    //_ Cities
    CITIES.forEach(async (city) => {
      const cityEntity = await createCityEntity(city)

      cityEntity.card.container.on("pointerdown", () => cityEntity.view.show())

      cards.addItem(cityEntity.card.container)
      overlay.addChild(cityEntity.view.container)
    })

    //_ Announcements
    announcements.addToWorld(gamescreen)

    //_ Analysis
    const analysis = await createAnalysisWindow()
    gamescreen.addChild(analysis.container)

    //_ Sidebar
    const { container: sidebarContainer, buttons } = await createSidebar()
    sidebarContainer.position.set(dims.width - 24, 8)

    const [menuButton, analysisButton, missionsButton, mapButton, turnButton] =
      buttons

    gamescreen.addChild(sidebarContainer)

    turnButton.on("click", () => {
      for (const player of queries.player) {
        player.readyForNext = true
        cards.resetView()
      }
    })

    const missionsUi = await createMissionsUi()
    gamescreen.addChild(missionsUi.container)

    missionsButton.on("pointerdown", () => {
      missionsUi.show()
    })

    analysisButton.on("pointerdown", () => {
      analysis.show()
    })
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
