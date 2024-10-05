import { createMission, queries, removeFromPipeline } from "../entities"
import { Container, Sprite } from "pixi.js"
import { announcements } from "../layout/announcements"
import { MISSIONS } from "../data/missions"

export const turnSystem = async (gamescreen: Container) => {
  const readies = []
  for (const ready of queries.readyForNext) {
    readies.push(ready.readyForNext)
  }

  if (readies.length && readies.every((ready) => ready)) {
    buildPipelineSystem()

    for (const player of queries.player) {
      player.readyForNext = false
      updateScores()
      player.needsUpdate = true
      await announcements.addNotification(player.year)
    }

    await createMissionSystem()
    announceMissionSystem(gamescreen)
  }
}

const createMissionSystem = async () => {
  for (const player of queries.player) {
    if (player.year % 10 === 0) {
      const mission = MISSIONS[0]
      await createMission(mission.title, mission.description, mission.reward)
    }
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
  let population = 0
  let soldiers = 0

  for (const player of queries.player) {
    for (const city of queries.cities) {
      population += city.population
      soldiers += city.soldiers
    }

    player.population = population
    player.soldiers = soldiers
    player.year += 1

    player.money += population - soldiers * 2
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

const announceMissionSystem = (gamescreen: Container) => {
  for (const mission of queries.missions) {
    if (mission.acknowledged === true) continue

    //_ Lock the game until acknowledged
    mission.readyForNext = false
    mission.ui.addToWorld(gamescreen)
  }
}
