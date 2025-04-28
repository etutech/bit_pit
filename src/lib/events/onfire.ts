/**
 * mini (~500 b) version for event-emitter.
 *
 * Created by hustcc on 2018/12/31
 * Contract: vip@hust.edu.cn
 */

interface Listener {
  cb: Function
  once: boolean
}

type EventsType = Record<string, Listener[]>

/**
 * const ee = new OnFire();
 *
 * ee.on('click', (...values) => {});
 *
 * ee.on('mouseover', (...values) => {});
 *
 * ee.emit('click', 1, 2, 3);
 * ee.fire('mouseover', {}); // same with emit
 *
 * ee.off();
 */
export default class OnFire {
  static ver = '__VERSION__'

  private _name: string

  constructor(_name: string = '') {
    this._name = _name
  }

  get name(): string {
    return this._name
  }

  // 所有事件的监听器
  private es: EventsType = {}

  on(eventName: string, cb: Function, once: boolean = false) {
    if (!this.es[eventName]) {
      this.es[eventName] = []
    }

    this.es[eventName].push({
      cb,
      once
    })
  }

  once(eventName: string, cb: Function) {
    this.on(eventName, cb, true)
  }

  fire(eventName: string, ...params: any[]) {
    const listeners = this.es[eventName] || []

    let l = listeners.length

    for (let i = 0; i < l; i += 1) {
      const { cb, once } = listeners[i]

      const ret = cb.apply(this, params)


      if (once) {
        listeners.splice(i, 1)
        i -= 1
        l -= 1
      }
      if (l === 1) return ret
    }
  }

  off(eventName?: string, cb?: Function) {
    if (eventName === undefined) {
      this.es = {}
    } else if (cb === undefined) {
      if (!this.es[eventName] || this.es[eventName].length === 0) return
      delete this.es[eventName]
    } else {
      const listeners = this.es[eventName] || []
      let l = listeners.length
      for (let i = 0; i < l; i += 1) {
        if (listeners[i].cb === cb) {
          listeners.splice(i, 1)
          i -= 1
          l -= 1
        }
      }
    }
  }

  // cname of fire
  emit(eventName: string, ...params: any[]) {
    this.fire(eventName, ...params)
  }
}
