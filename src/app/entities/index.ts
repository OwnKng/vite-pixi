import { World } from "miniplex"
import { Container, Sprite } from "pixi.js"
import { createCityView } from "../views"
import { createPipelineUi } from "../layout/pipeline"
import { EntityUI } from "../layout/types"

type Building = {
  name: string
  level: number
}

export type Upgrade = {
  name: string
  level: number
  cost: number
  city: string
  sprite: Sprite
}

export type Player = {
  name: string
  money: number
  health: number
}

export type City = {
  name: string
  population: number
  buildings: Building[]
  details: View
  summary: View
}

export type Pipeline = {
  upgrades: Upgrade[]
  readyForNext: boolean
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
}

export const createPlayerEntity = () =>
  world.add({ name: "Player", money: 1000, health: 100 })

export const createPipeline = async () =>
  world.add({
    upgrades: [],
    readyForNext: false,
    ui: await createPipelineUi(),
    needsUpdate: false,
  })

export const addToPipeline = (upgrade: Upgrade) => {
  const pipeline = queries.pipeline.first
  pipeline.upgrades.push(upgrade)

  for (const player of queries.player) {
    player.money -= upgrade.cost
  }

  pipeline.needsUpdate = true
}

export const removeFromPipeline = (upgrade: Upgrade) => {
  const pipeline = queries.pipeline.first
  pipeline.upgrades = pipeline.upgrades.filter((u) => u !== upgrade)

  for (const player of queries.player) {
    player.money += upgrade.cost
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
  const view = createCityView()

  return world.add({
    name,
    population,
    buildings,
    view: {
      hidden: true,
      ...view,
    },
  })
}
