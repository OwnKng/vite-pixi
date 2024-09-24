import type { Container } from "pixi.js"

export type EntityUI = {
  container: Container

  show: () => void
  hide: () => void
  destroy: () => void
  addToWorld: (world: Container, x: number, y: number) => void
}
