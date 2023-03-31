import { UnwrapNestedRefs, reactive } from 'vue'

export default function useSubject<T extends {}> (store: T): UnwrapNestedRefs<T> {
  const subject =  reactive(store)

  const handlers: Map<string, Function> = new Map()
  const events: Map<string, Set<Function>> = new Map()

  Reflect.setPrototypeOf(subject, {
    handle (name: string, handler: Function) {
      if (!handlers.has(name)) handlers.set(name, handler)
    },
    async invoke (name: string, args: any) {
      if (handlers.has(name)) return handlers.get(name)?.(args)
    },
    invokeSync (name: string, args: any) {
      if (handlers.has(name)) return handlers.get(name)?.(args)
    },
    removeHandler (name: string) {
      if (handlers.has(name)) handlers.delete(name)
    },
    on (name: string, cb: () => void) {
      if (!events.has(name)) events.set(name, new Set())

      events.get(name)?.add(cb)
    },
    emit (name: string, data: any) {
      if (events.has(name)) events.get(name)?.forEach(cb => cb(data))
    },
    off (name: string, cb: () => void) {
      if (events.has(name)) events.get(name)?.delete(cb)
    }
  })

  return subject
}