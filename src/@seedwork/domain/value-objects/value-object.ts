import { deepFreeze } from '../utils/object'

export abstract class ValueObject<Value = any> {
  protected readonly _value: Value

  constructor(_value: Value) {
    if ([null, undefined].includes(_value)) {
      throw new Error('Value cannot be null or undefined')
    }
    this._value = deepFreeze(_value)
  }

  get value() {
    return this._value
  }

  toString(): string {
    if (typeof this.value !== 'object' || this.value === null) {
      try {
        return this._value.toString()
      } catch (error) {
        return `${this.value}`
      }
    }

    const valueStr = this.value.toString()
    return valueStr === '[object Object]' ? JSON.stringify(this.value) : valueStr
  }
}