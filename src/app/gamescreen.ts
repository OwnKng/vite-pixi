import { Container, Sprite } from "pixi.js"
import { loadPlayingAssets } from "./loaders/assets"
import { dims, CITIES } from "./consts"
import { createScrollingCards } from "./cards"
import { createCityEntity } from "./entities"
import { createCityView } from "./views"

const cityView = createCityView()

function createGameScreen() {
  let gamescreen = new Container()

  const cards = createScrollingCards(0, 80)
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

    CITIES.forEach((city) => {
      const cityEntity = createCityEntity(city)

      cards.addItem(city.name, async () => await cityView.show(cityEntity))
    })
  }

  function newTurn() {}

  return {
    init,
    container: gamescreen,
  }
}

export const gameScreen = createGameScreen()
