import { queries } from "../entities"

export const endTurn = () => {
  for (const city of queries.cities) {
    city.underConstruction.forEach((constructionProject) => {
      constructionProject.turns -= 1
      if (constructionProject.turns <= 0) {
        city.buildings.push({
          name: constructionProject.name,
          level: constructionProject.level,
        })
      }
    })

    city.underConstruction = city.underConstruction.filter(
      (project) => constructionProject.turns <= 0
    )
  }
}

export function turnStart() {
  for (const entity of queries.cities) {
  }
}
