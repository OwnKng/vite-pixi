import { World } from "miniplex"
import { Container, Texture } from "pixi.js"
import { createPipelineUi } from "../layout/pipeline"
import { EntityUI } from "../layout/types"
import { createCityCard } from "../cards"
import { createScoreboard, Scoreboard } from "../views/scoreboard"
import type { CityView } from "../views/city"
import { createCityView } from "../views/city"
import type { Sprite } from "pixi.js"
import { createMissionCard } from "../views/mission"

export type Upgrade = {
  name: string
  cost: number
  city: string
  texture: Texture
  population?: number
  soldiers?: number
  description: string
}

export type Mission = {
  name: string
  description: string
  reward: number
  completed: boolean
  initialValue: number
  currentValue: number
  readyForNext: boolean
  acknowledged: boolean
  ui: EntityUI
}

export type Player = {
  name: string
  money: number
  population: number
  soliders: number
  scoreboard: Scoreboard
  needsUpdate: boolean
  readyForNext: boolean
  sprite: Sprite
  year: number
}

export type City = {
  name: string
  population: number
  soldiers: number
  card: EntityUI
  view: CityView
  needsUIUpdate: boolean
  upgrade: Upgrade
}

export type Pipeline = {
  upgrades: Upgrade[]
  ui: EntityUI
  needsUpdate: boolean
}

export type View = {
  hidden: boolean
  container: Container
  show: () => void
  hide: () => void
  update: () => void
}

export const world = new World()

export const queries = {
  cities: world.with("card"),
  views: world.with("view"),
  pipeline: world.with("upgrades"),
  player: world.with("money"),
  readyForNext: world.with("readyForNext"),
  missions: world.with("reward"),
}

export const createPlayerEntity = async (
  name: string,
  sprite: Sprite,
  money: number,
  population: number,
  soldiers: number,
  year?: number
) =>
  world.add({
    name: name,
    money: 1000,
    population: 0,
    soldiers: 0,
    needsUpdate: false,
    readyForNext: false,
    year: year || 1066,
    scoreboard: await createScoreboard({
      money,
      population,
      soldiers,
    }),
    sprite,
  })

export const createPipeline = async () =>
  world.add({
    upgrades: [],
    ui: await createPipelineUi(),
    needsUpdate: false,
  })

export const addToPipeline = (upgrade: Upgrade) => {
  const pipeline = queries.pipeline.first

  for (const player of queries.player) {
    if (player.money < upgrade.cost) {
      return
    }
    player.money -= upgrade.cost
    player.needsUpdate = true
  }

  // Add to pipeline
  pipeline.upgrades.push(upgrade)
  pipeline.needsUpdate = true

  // Update the city card
  for (const city of queries.cities) {
    if (city.name === upgrade.city) {
      city.card.setBuilding()
    }
  }
}

export const removeFromPipeline = (upgrade: Upgrade) => {
  const pipeline = queries.pipeline.first
  pipeline.upgrades = pipeline.upgrades.filter((u) => u !== upgrade)

  for (const player of queries.player) {
    player.money += upgrade.cost
    player.needsUpdate = true
  }

  for (const city of queries.cities) {
    if (city.name === upgrade.city) {
      city.card.removeBuilding()
    }
  }

  pipeline.needsUpdate = true
}

export const createCityEntity = async ({
  name,
  population,
}: {
  name: string
  population: number
  selected?: boolean
  underConstruction?: Upgrade[]
}) => {
  const card = await createCityCard({ title: name })

  const cityEntity = world.add({
    name,
    population,
    card,
    needsUIUpdate: false,
    soldiers: 0,
  })

  const view = await createCityView(cityEntity)

  cityEntity.view = view

  return cityEntity
}

export const createMission = async (
  name: string,
  description: string,
  reward: number
) => {
  const mission = await world.add({
    name,
    description,
    reward,
    completed: false,
    initialValue: 0,
    currentValue: 0,
    readyForNext: true,
    acknowledged: false,
    active: false,
  })

  mission.ui = await createMissionCard({
    name: name,
    description: description,
    reward: reward,
    close: () => {
      mission.acknowledged = true
      mission.readyForNext = true
      mission.active = true
    },
  })

  return mission
}
