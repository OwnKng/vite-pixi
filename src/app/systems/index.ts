import { queries, removeFromPipeline } from "../entities"
import { Sprite } from "pixi.js"
import { announcements } from "../layout/announcements"

export const turnSystem = () => {
  const readies = []
  for (const ready of queries.readyForNext) {
    readies.push(ready.readyForNext)
  }

  if (readies.length && readies.every((ready) => ready)) {
    buildPipelineSystem()
    updateScores()
    announcements.addNotification("Next turn")
  }

  for (const player of queries.player) {
    player.readyForNext = false
    player.needsUpdate = true
  }
}

const buildPipelineSystem = () => {
  for (const pipeline of queries.pipeline) {
    for (const upgrade of pipeline.upgrades) {
      for (const city of queries.cities) {
        if (city.name === upgrade.city) {
          city.soldiers += upgrade.soldiers
          city.population += upgrade.population
          city.card.removeBuilding()
        }
      }
    }

    pipeline.upgrades = []
    pipeline.needsUpdate = true
  }
}

const updateScores = () => {
  for (const player of queries.player) {
    for (const city of queries.cities) {
      player.money += city.population * 10
      player.population += city.population
      player.soldiers += city.soldiers
    }
  }
}

export const scoreboardSystem = () => {
  for (const player of queries.player) {
    if (!player.needsUpdate) continue

    player.scoreboard.update({
      money: player.money,
      population: player.population,
      soldiers: player.soldiers,
    })

    player.needsUpdate = false
  }
}

export const updatePipelineUi = () => {
  let offset = 0

  for (const pipeline of queries.pipeline) {
    if (!pipeline.needsUpdate) continue
    const { ui, upgrades } = pipeline

    ui.container.removeChildren()

    upgrades.forEach((upgrade) => {
      const sprite = Sprite.from(upgrade.texture)
      sprite.eventMode = "static"

      sprite.x = offset
      offset += sprite.width

      sprite.on("click", () => removeFromPipeline(upgrade))
      ui.container.addChild(sprite)
    })

    pipeline.needsUpdate = false
  }
}
