export const dims = {
  width: 320,
  height: 180,
}

export const zIndexLevels = {
  low: 0,
  medium: 1,
  high: 2,
}

export const upgrades = [
  {
    name: "house",
    texture: "light",
    cost: 100,
    population: 1,
    soldiers: 0,
    description:
      "Houses provide shelter for your citizens. Increasing the number of houses will increase your population and tax base. \n \nCost: 100 \nPopulation: +100",
  },
  {
    name: "barracks",
    texture: "light",
    cost: 500,
    population: 0,
    soldiers: 10,
    description:
      "Barracks provide training for your soldiers. Increasing the number of barracks will increase your army size and defense. \n \nCost: 500 \nSoldiers: +10",
  },
]

export const CITIES = [
  {
    name: "London",
    population: 10,
    soldiers: 4,
  },
  {
    name: "Paris",
    population: 10,
    soldiers: 2,
  },
  {
    name: "Nottingham",
    population: 5,
    soldiers: 1,
  },
  {
    name: "York",
    population: 5,
    soldiers: 1,
  },
  {
    name: "Edinburgh",
    population: 3,
    soldiers: 1,
  },
]
