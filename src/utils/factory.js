export function hasArrayChild(obj, childrenKey) {
  return obj[childrenKey] && Array.isArray(obj[childrenKey])
}

let id = 0

export function getId() {
  return ++id
}

export function fireEvent(element, event) {
  if (document.createEventObject) {
    // IE浏览器支持fireEvent方法
    var evt = document.createEventObject()
    return element.fireEvent('on' + event, evt)
  } else {
    // 其他标准浏览器使用dispatchEvent方法
    var evt = document.createEvent('HTMLEvents')
    evt.initEvent(event, true, true)
    return !element.dispatchEvent(evt)
  }
}

export function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
}

export const completeDeepClone = function(target, hash = new WeakMap()) {
  if (target == null) {
    return target
  }
  const NewCtor = target.constructor
  if (target instanceof Boolean || target instanceof Date || target instanceof String || target instanceof Number || target instanceof RegExp) {
    return new NewCtor(target)
  }
  if (target instanceof Error) {
    return new Error(target.message)
  }
  // 增加Symbol拷贝
  if (target instanceof Symbol) {
    return Object(Symbol.prototype.valueOf.call(target))
  }
  if (typeof target !== 'object') {
    return target
  }
  if (hash.has(target)) {
    return hash.get(target)
  }
  // 增加Set拷贝
  if (target instanceof Set) {
    const cloneObj = new NewCtor(target)
    target.forEach((it) => {
      cloneObj.add(completeDeepClone(it, hash))
    })
    return cloneObj
  }
  // 增加Map拷贝
  if (target instanceof Map) {
    const cloneObj = new NewCtor(target)
    target.forEach((it, key) => {
      cloneObj.set(key, completeDeepClone(it, hash))
    })
    return cloneObj
  }
  // 如果是object类型的数据:
  const newObj = new NewCtor()
  hash.set(target, newObj)
  for (const key in target) {
    if (target.hasOwnProperty(key)) {
      newObj[key] = completeDeepClone(target[key], hash)
    }
  }
  return newObj
}