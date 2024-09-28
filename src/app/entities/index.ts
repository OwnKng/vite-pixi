import { World } from "miniplex"
import { Container, Texture } from "pixi.js"
import { createPipelineUi } from "../layout/pipeline"
import { EntityUI } from "../layout/types"
import { createCityCard } from "../cards"
import { createScoreboard, Scoreboard } from "../views/scoreboard"

type Building = {
  name: string
  level: number
}

export type Upgrade = {
  name: string
  level: number
  cost: number
  city: string
  texture: Texture
}

export type Player = {
  name: string
  money: number
  population: number
  soliders: number
  scoreboard: Scoreboard
  needsUpdate: boolean
  readyForNext: boolean
}

export type City = {
  name: string
  population: number
  card: EntityUI
  details: View
  summary: View
  needsUIUpdate: boolean
  upgrades: Upgrade[]
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
  cities: world.with("name"),
  views: world.with("view"),
  pipeline: world.with("upgrades"),
  player: world.with("money"),
  readyForNext: world.with("readyForNext"),
}

export const createPlayerEntity = () =>
  world.add({
    name: "Player",
    money: 1000,
    population: 0,
    soldiers: 0,
    needsUpdate: false,
    readyForNext: false,
    scoreboard: createScoreboard({
      money: 1000,
      population: 0,
      soldiers: 0,
    }),
  })

export const createPipeline = async () =>
  world.add({
    upgrades: [],
    ui: await createPipelineUi(),
    needsUpdate: false,
  })

export const addToPipeline = (upgrade: Upgrade) => {
  const pipeline = queries.pipeline.first
  pipeline.upgrades.push(upgrade)

  for (const player of queries.player) {
    player.money -= upgrade.cost
    player.needsUpdate = true
  }

  pipeline.needsUpdate = true

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

export const createCityEntity = ({
  name,
  population,
  buildings = [],
}: {
  name: string
  population: number
  buildings?: Building[]
  selected?: boolean
  underConstruction?: Upgrade[]
}) => {
  const card = createCityCard({ title: name })

  return world.add({
    name,
    population,
    buildings,
    card,
    needsUIUpdate: false,
  })
}
