import Controller from "./controller.js"
import Service from "./service.js"
import View from "./view.js"
import Camera from "../../../lib/shared/camera.js"
import { supportsWokerType } from "../../../lib/shared/util.js"


async function getWorker() {
    if (supportsWokerType()) {
        const worker = new Worker('./src/worker.js', { type: 'module' })
        return worker
    }

    const workerMock = {
        async postMessage() {},
        onmessage(msg) {}
    }

    return workerMock
}

const worker = await getWorker()

const camera = await Camera.init()
const [rootPath] = window.location.href.split('/pages/')
const factory = {
  async initalize() {
    return Controller.initialize({
      view: new View(),
      service: new Service({

      }),
      worker
    })
  }
}

export default factory