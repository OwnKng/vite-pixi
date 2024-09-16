import { World } from "miniplex"
import { Container } from "pixi.js"
import { createCityView } from "../views"

type Building = {
  name: string
  level: number
}

export type Construction = {
  name: string
  level: number
  turns: number
  turnsLeft: number
  cost: number
}

export type City = {
  name: string
  population: number
  buildings: Building[]
  underConstruction: Construction[]
  details: View
  summary: View
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
}

export type Entity = {
  name: string
  population: number
  buildings: Building[]
  underConstruction: Construction[]
}

export const createCityEntity = ({
  name,
  population,
  buildings = [],
  underConstruction = [],
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
    underConstruction,
    view: {
      hidden: true,
      ...view,
    },
  })
}
