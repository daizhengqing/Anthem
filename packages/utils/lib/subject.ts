export default class Subject {
  constructor (state, options) {
    this.#proxy(state)
  }

  #proxy (state) {
    new Proxy(state, {
      get () {},
    })
  }

  subscribe (keys: string[], cb) {}

  unsubscribe (keys: string) {}
}