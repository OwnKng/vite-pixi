import { Container, Text } from "pixi.js"

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

export const createScoreboard = (score: Score) => {
  const container = new Container()

  const moneyText = new Text({
    text: score.money,
    style: { fontSize: 48 },
  })

  moneyText.scale = 0.125

  container.addChild(moneyText)

  const addToWorld = (parent: Container) => parent.addChild(container)

  const update = (score: Score) => {
    moneyText.text = score.money
  }

  return {
    container,
    update,
    addToWorld,
  }
}
