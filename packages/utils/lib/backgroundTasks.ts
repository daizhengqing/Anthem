export interface Task {
  job: () => void
}

export default class BackgroundTasks {
  #queue: Task[] = []

  #lock: null | Promise<void> = null

  constructor () {}

  async push (task) {
    if (this.#lock) await this.#lock

    this.#queue.push(task)

    if (this.#queue.length === 1) this.#execute()
  }

  #execute () {
    this.#lock = new Promise(resolve => {
      const task = this.#queue.shift()

      window.requestIdleCallback(IdleDeadline => {
        if (IdleDeadline.didTimeout) {
          this.#queue.unshift(task)
        } else {
          task.job()
        }

        resolve()

        if (this.#queue.length > 0) this.#execute()
      })
    })
  }
}