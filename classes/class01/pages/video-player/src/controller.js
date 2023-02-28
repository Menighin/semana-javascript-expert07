export default class Controller {

    #view
    #camera
    #worker
    #blinkCounter = 0

    constructor({ view, worker, camera }) {
        this.#view = view
        this.#worker = this.#configureWorker(worker)
        this.#camera = camera

        this.#view.configureOnBtnClick(this.onBtnStart.bind(this))
    }

    static async initialize(deps) {
        const c = new Controller(deps)

        c.log('not yet detecting eye. click to start')

        return c.init()
    }

    #configureWorker(worker) {
        let ready = false
        worker.onmessage = ({ data }) => {
            if ('READY' === data) {
                this.#view.enableButton()
                ready = true
            }
            const blinked = data.blinked
            this.#blinkCounter += blinked
            if (blinked) {
                this.log(`Blink counter: ${this.#blinkCounter}`)
                this.#view.togglePlayVideo()
            }
        }
        return {
            send (msg) {
                if (!ready) return;
                worker.postMessage(msg)
            }
        }
    }

    async init() {

    }

    loop() {
        const video = this.#camera.video
        const img = this.#view.getVideoFrame(video)

        this.#worker.send(img)

        setTimeout(() => this.loop(), 100);
    }

    log(text) {
        this.#view.log(text)
    }

    onBtnStart() {
        this.log('initializing detection')
        this.#blinkCounter = 0
        this.loop()
    }
}