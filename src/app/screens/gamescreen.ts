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

export function createGameScreen() {
  let gamescreen = new Container()
  gamescreen.zIndex = zIndexLevels.low

  const cards = createGrid({
    width: 320,
    height: 96,
    gap: 8,
    scrollOffset: 8,
  })

  cards.container.position.y = 80

  gamescreen.addChild(cards.container)

  const overlay = new Container()
  overlay.zIndex = zIndexLevels.high
  gamescreen.addChild(overlay)

  async function init() {
    const { menu } = await loadPlayingAssets()
    menu.source.scaleMode = "nearest"

    const menuSprite = Sprite.from(menu)
    menuSprite.position.x = dims.width - menuSprite.width

    gamescreen.addChild(menuSprite)

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

    //_ Turn button
    const { buttonTexture } = await loadCoreAssets()

    const turnButton = createButton({
      buttonText: "End Turn",
      texture: buttonTexture,
      hoverTexture: buttonTexture,
      onclick: () => {
        turnButton.on("pointerdown", () => {
          for (const player of queries.player) {
            player.readyForNext = true
            cards.resetView()
          }
        })
      },
    })

    turnButton.position.set(16 * 12, 16 * 1)
    gamescreen.addChild(turnButton)

    //_ Announcements
    announcements.addToWorld(gamescreen)
  }

  Ticker.shared.add((time) => {
    updatePipelineUi()
    scoreboardSystem()
    turnSystem()
  })

  return {
    init,
    container: gamescreen,
  }
}
