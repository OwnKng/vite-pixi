import { queries, removeFromPipeline } from "../entities"
import { Container, Sprite } from "pixi.js"
import { announcements } from "../layout/announcements"
import { createMissionCard } from "../views/mission"

export const turnSystem = async (gamescreen: Container) => {
  const readies = []
  for (const ready of queries.readyForNext) {
    readies.push(ready.readyForNext)
  }

  if (readies.length && readies.every((ready) => ready)) {
    buildPipelineSystem()
    updateScores()
    announcements.addNotification("Next turn")

    for (const player of queries.player) {
      player.readyForNext = false
      player.needsUpdate = true
    }

    await newMissionSystem(gamescreen)
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
  let index = 0

  for (const pipeline of queries.pipeline) {
    if (!pipeline.needsUpdate) continue
    const { ui, upgrades } = pipeline

    ui.container.removeChildren()

    upgrades.forEach((upgrade) => {
      const sprite = Sprite.from(upgrade.texture)
      sprite.eventMode = "static"

      // Increment in units of three
      sprite.x = (index % 3) * 16
      sprite.y = Math.floor(index / 3) * 16
      index++

      sprite.on("click", () => removeFromPipeline(upgrade))
      ui.container.addChild(sprite)
    })

    pipeline.needsUpdate = false
  }
}

export const newMissionSystem = async (gamescreen: Container) => {
  for (const mission of queries.missions) {
    if (mission.acknowledged === true) continue

    // Lock the game until acknowledged
    mission.readyForNext = false

    const missionUi = await createMissionCard({
      name: mission.name,
      description: mission.description,
      reward: mission.reward,
      close: () => {
        mission.acknowledged = true
        mission.readyForNext = true
        mission.active = true
      },
    })

    missionUi.addToWorld(gamescreen)
  }
}
