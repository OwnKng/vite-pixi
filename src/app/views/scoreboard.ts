import { Container, Sprite, Text, TextStyle } from "pixi.js"
import { loadCoreAssets } from "../loaders/assets"
import { lightTextStyles } from "../layout/utils"

type Score = {
  money: number
  population: number
  soldiers: number
}

export type Scoreboard = {
  container: Container
  update: (score: Score) => void
  addToWorld: (parent: Container) => void
}

export const createScoreboard = async (score: Score) => {
  const container = new Container()

  const { scorecardTexture } = await loadCoreAssets()
  scorecardTexture.source.scaleMode = "nearest"
  const scorecardSprite = Sprite.from(scorecardTexture.source)

  container.addChild(scorecardSprite)

  const moneyText = new Text({
    text: score.money,
    style: new TextStyle({ ...lightTextStyles }),
  })

  moneyText.scale = 0.125
  moneyText.anchor.set(1, 0)
  moneyText.position.x = container.width - 4
  moneyText.position.y = 1

  //_ Population text
  const populationText = new Text({
    text: score.population,
    style: new TextStyle({ ...lightTextStyles }),
  })

  populationText.scale = 0.125
  populationText.anchor.set(1, 0)
  populationText.position.x = container.width - 4
  populationText.position.y = 1 + 16

  //_ Soldiers text
  const soldiersText = new Text({
    text: score.soldiers,
    style: new TextStyle({ ...lightTextStyles }),
  })

  soldiersText.scale = 0.125
  soldiersText.anchor.set(1, 0)
  soldiersText.position.x = container.width - 4
  soldiersText.position.y = 1 + 32

  container.addChild(moneyText)
  container.addChild(populationText)
  container.addChild(soldiersText)

  const addToWorld = (parent: Container) => parent.addChild(container)

  const update = (score: Score) => {
    moneyText.text = score.money
    populationText.text = score.population
    soldiersText.text = score.soldiers
  }

  return {
    container,
    update,
    addToWorld,
  }
}
