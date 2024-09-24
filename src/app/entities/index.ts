import { World } from "miniplex"
import { Container, Sprite } from "pixi.js"
import { createCityView } from "../views"
import { createPipelineUi } from "../layout/pipeline"
import { EntityUI } from "../layout/types"

type Building = {
  name: string
  level: number
}

export type Construction = {
  name: string
  level: number
  cost: number
  city: string
  sprite: Sprite
}

export type City = {
  name: string
  population: number
  buildings: Building[]
  details: View
  summary: View
}

export type Pipeline = {
  construction: Construction[]
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
  pipeline: world.with("construction"),
}

export const createPipeline = () =>
  world.add({
    construction: [],
    readyForNext: false,
    ui: createPipelineUi(),
    needsUpdate: false,
  })

export const addToPipeline = (construction: Construction) => {
  const pipeline = queries.pipeline.first
  pipeline.construction.push(construction)

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
  underConstruction?: Construction[]
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
