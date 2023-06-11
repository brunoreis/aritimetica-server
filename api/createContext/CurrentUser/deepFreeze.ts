export function deepFreeze<T>(obj: T): Readonly<T> {
  Object.freeze(obj)

  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      const value = obj[prop]

      if (typeof value === 'object' && value !== null) {
        deepFreeze(value)
      }
    }
  }

  return obj
}
