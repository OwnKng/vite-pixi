import { Container, Text, TextStyle } from "pixi.js"
import { lightTextStyles } from "./utils"

type Column = {
  name: string
  accessor: string
  format?: (value: any) => any
}

type TableArgs = {
  data: any[]
  columns: Column[]
  width: number
  height: number
}

export const createTable = ({ data, columns, width, height }: TableArgs) => {
  const container = new Container()

  const header = new Container()

  columns.forEach((column, i) => {
    const text = new Text({
      text: column.name,
      style: new TextStyle({ lightTextStyles }),
    })

    text.x = (i * width) / columns.length
    text.y = 0

    header.addChild(text)
  })

  return {
    container,
  }
}
