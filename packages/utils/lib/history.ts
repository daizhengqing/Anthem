class History {
  constructor () {
    Object.assign(this, {
      max: 20,
      link: null,
      current: null
    })
  }

  create (data) {
    const item = {
      prev: this.current,
      index: (this.current?.index ?? -1) ?? + 1,
      data,
      next: null
    }

    if (item.index === 20) this.removeHead()

    if (!this.link) this.link = item
		
		if (this.current) this.current.next = item

    this.current = item
  }

  removeHead () {
    this.link.next.prev = null
		
		this.link = this.link.next
  }

  undo () {
    if (!this.current || !this.current.prev) return

    this.current = this.current.prev

    return this.current.data
  }

  redo () {
    if (!this.current || !this.current.next) return

    this.current = this.current.next

    return this.current.data
  }
}

export default History

// const history = new History()
// history.create(1)
// history.create(2)
// history.create(3)
// history.create(4)
// console.log(history)
// console.log(history.undo())
// console.log(history.undo())
// console.log(history.undo())
// console.log(history.redo())
// console.log(history.redo())

