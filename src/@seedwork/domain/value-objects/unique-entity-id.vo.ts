import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

import { ValueObject } from './value-object';
import { InvalidUuidError } from "../errors/invalid-uuid.error";

export class UniqueEntityId extends ValueObject<string> {
  constructor(id?: string) {
    super(id || uuidv4())
    this.validate()
  }

  private validate() {
    const isValid = uuidValidate(this.value)
    if (!isValid) {
      throw new InvalidUuidError()
    }
  }
}