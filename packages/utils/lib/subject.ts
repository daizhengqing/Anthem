class Broadcast {
	constructor (options) {
		Object.assign(this, {
			store: {}
		}, options, {
			handlers: new Map(),
			messages: new Map(),
			watcher: new Map()
		})
		
		this.store = new Proxy(this.store, {
			set (target, propKey, value, receiver) {
				if (this.watcher.has(propKey)) {
					this.watcher.get(propKey).forEach(fn => fn(value, target[propKey]));
				}
				
				return Reflect.set(target, propKey, value, receiver);
			}
		})
	}
	
	watch (propKey, fn) {
		if (this.watcher.has(propKey)) {
			this.watcher.get(propKey).add(fn)
		} else {
			this.watcher.set(propKey, new Set([fn]))
		}
	}
	
	unWatch (propKey, fn) {
		if (this.watcher.has(propKey)) {
			this.watcher.get(propKey).delete(fn)
		}
	}
	
	async invoke (name, args) {
		return await this.handlers.get(name)(args);
	}
	
	handle (name, handler) {
		if (!this.handlers.has(name)) this.handlers.set(name, handler);
	}
	
	removeHandler (name) {
		if (this.handlers.has(name)) this.handlers.delete(name)
	}
	
	on (channel, method) {
		if (this.messages.has(channel)) {
			this.messages.set(channel, this.messages.get(channel).add(method))
		} else {
			this.messages.set(channel, new Set([method]))
		}
	}
	
	emit (channel, args) {
		if (this.messages.has(channel)) this.messages.get(channel).forEach(method => method(args))
	}
	
	off (channel, method) {
		if (this.messages.has(channel)) {
			if (method) this.messages.get(channel).delete(method)
			else this.messages.delete(channel)
		}
	}
	
	destroy () {
		this.handlers = new Map()
		
		this.messages = new Map()
	}
}

export default Broadcast

// const broadcast = new Broadcast({store:{a:233}})

// console.log(broadcast)
// console.log(broadcast.store)

// broadcast.watch('a', console.log)

// broadcast.store.a = 666

// broadcast.handle('/test', args => {
// 	console.log(args)
// })

// broadcast.invoke('/test', 666)

// broadcast.on('/test', args => {
// 	console.log(args)
// })

// broadcast.on('/test', args => {
// 	console.log(args + 1)
// })

// broadcast.emit('/test', 'haha')

// broadcast.off('/test')

// broadcast.emit('/test', 999)