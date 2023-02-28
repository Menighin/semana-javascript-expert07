export default class Controller {

    #view
    #service
    #worker

    constructor({ view, service, worker }) {
        this.#view = view
        this.#service = service
        this.#worker = this.#configureWorker(worker)

        this.#view.configureOnBtnClick(this.onBtnStart.bind(this))
    }

    static async initialize(deps) {
        const c = new Controller(deps)

        c.log('not yet detecting eye. click to start')

        return c.init()
    }

    #configureWorker(worker) {
        worker.onmessage = (msg) => {
            if ('READY' === msg.data) {
                this.#view.enableButton()
            }
        }

        return worker
    }

    async init() {

    }

    log(text) {
        this.#view.log(text)
    }

    onBtnStart() {
        this.log('initializing detection')
    }
}