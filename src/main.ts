import "./style.css"
import createApplication from "./app/index.ts"
import { dims } from "./app/consts.ts"
import "@fontsource-variable/pixelify-sans"

const container = document.querySelector<HTMLDivElement>("#app")!
const gamewindow = document.getElementById("gamewindow")!

const fullscreenButton = document.getElementById("fullscreen")!
fullscreenButton.addEventListener("click", toggleFullscreen)

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

const desiredAspectRatio = dims.width / dims.height

function resizeGameWindow() {
  const containerWidth = container.clientWidth
  const containerHeight = container.clientHeight - 32

  const containerAspectRatio = containerWidth / containerHeight

  if (containerAspectRatio > desiredAspectRatio) {
    // Container is wider than the desired aspect ratio
    gamewindow.style.width = `${containerHeight * desiredAspectRatio}px`
    gamewindow.style.height = `${containerHeight}px`
  } else {
    // Container is taller than the desired aspect ratio
    gamewindow.style.width = `${containerWidth}px`
    gamewindow.style.height = `${containerWidth / desiredAspectRatio}px`
  }
}

async function main() {
  const pixi = createApplication()

  const { app, loadCoreAssets, startGame } = pixi

  await app.init({
    resizeTo: gamewindow,
    backgroundColor: 0x10141f,
  })

  await loadCoreAssets()
  gamewindow.appendChild(app.canvas)

  await startGame()
}

resizeGameWindow()
window.addEventListener("resize", resizeGameWindow)

main()
