import { Container, Sprite } from "pixi.js"
import { loadPlayingAssets } from "./loaders/assets"
import { dims, CITIES } from "./consts"
import { createCityCard } from "./cards"
import { createCityEntity, createPipeline } from "./entities"
import { createCityView } from "./views"
import { createGrid } from "./layout/grid"

const cityView = createCityView()

function createGameScreen() {
  let gamescreen = new Container()

  const cards = createGrid({
    width: 320,
    height: 96,
    gap: 8,
    scrollOffset: 8,
  })

  cards.container.position.y = 80

  gamescreen.addChild(cards.container)

  const overlay = new Container()
  gamescreen.addChild(overlay)

  overlay.addChild(cityView.container)

  async function init() {
    const { navigation, menu } = await loadPlayingAssets()
    navigation.source.scaleMode = "nearest"
    menu.source.scaleMode = "nearest"

    const navigationSprite = Sprite.from(navigation)

    const menuSprite = Sprite.from(menu)
    menuSprite.position.x = dims.width - menuSprite.width

    gamescreen.addChild(navigationSprite, menuSprite)

    const pipeline = createPipeline()
    pipeline.ui.addToWorld(gamescreen, 0, 0)
    pipeline.ui.show()

    CITIES.forEach((city) => {
      const cityEntity = createCityEntity(city)
      const card = createCityCard({ title: cityEntity.name })

      card.container.on("pointerdown", () => cityView.show(cityEntity))

      cards.addItem(card.container)
    })
  }

  return {
    init,
    container: gamescreen,
  }
}

export const gameScreen = createGameScreen()
