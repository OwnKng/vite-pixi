import { Container, Sprite } from "pixi.js"
import { loadPlayingAssets } from "./loaders/assets"
import { dims, CITIES, zIndexLevels } from "./consts"
import {
  createCityEntity,
  createPipeline,
  createPlayerEntity,
} from "./entities"
import { createGrid } from "./layout/grid"
import { createEndTurnButton } from "./layout/endturn"
import { queries } from "./entities"
import { announcements } from "./layout/announcements"

function createGameScreen() {
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
    const { navigation, menu } = await loadPlayingAssets()
    navigation.source.scaleMode = "nearest"
    menu.source.scaleMode = "nearest"

    const navigationSprite = Sprite.from(navigation)

    const menuSprite = Sprite.from(menu)
    menuSprite.position.x = dims.width - menuSprite.width

    gamescreen.addChild(navigationSprite, menuSprite)

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
    const turnButton = createEndTurnButton()
    turnButton.container.position.set(16 * 12, 16 * 1)
    turnButton.addToWorld(gamescreen)

    turnButton.container.on("pointerdown", () => {
      for (const player of queries.player) {
        player.readyForNext = true
      }
    })

    //_ Announcements
    announcements.addToWorld(gamescreen)
  }

  return {
    init,
    container: gamescreen,
  }
}

export const gameScreen = createGameScreen()
