import { Container } from "pixi.js"
import { createTileset, loadCoreAssets } from "../loaders/assets"
import { createButton } from "./button"

export async function createSidebar() {
  const sidebar = new Container()
  const { buttonsSmall } = await loadCoreAssets()
  buttonsSmall.source.scaleMode = "nearest"
  const [
    buttonTexture,
    buttonHoverTexture,
    primaryButton,
    primaryButtonHovered,
  ] = createTileset(buttonsSmall, 16, 16)

  const buttons = [
    createButton({
      texture: buttonTexture.texture,
      hoverTexture: buttonHoverTexture.texture,
      buttonText: "",
      onclick: () => null,
    }),
    createButton({
      texture: buttonTexture.texture,
      hoverTexture: buttonHoverTexture.texture,
      buttonText: "",
      onclick: () => null,
    }),
    createButton({
      texture: buttonTexture.texture,
      hoverTexture: buttonHoverTexture.texture,
      buttonText: "",
      onclick: () => null,
    }),
    createButton({
      texture: buttonTexture.texture,
      hoverTexture: buttonHoverTexture.texture,
      buttonText: "",
      onclick: () => null,
    }),
    createButton({
      texture: primaryButton.texture,
      hoverTexture: primaryButtonHovered.texture,
      buttonText: "",
      onclick: () => null,
    }),
  ]

  buttons.forEach((button, i) => {
    button.position.set(0, i * 16)
    sidebar.addChild(button)
  })

  return {
    container: sidebar,
    buttons: buttons,
  }
}
