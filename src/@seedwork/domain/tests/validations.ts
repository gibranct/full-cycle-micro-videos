import { EntityValidationError } from "./../errors/validation-error";
import { objectContaining } from 'expect';

import { ValidatorFieldsInterface, FieldErrors } from './../validators/validator-fields-interface';

type Expected = { validator: ValidatorFieldsInterface<any>, data: any } | (() => any);

expect.extend({
  containsErrorMessages: (expected: Expected, received: FieldErrors) => {
    if (typeof expected === 'function') {
      try {
        expected();
        return {
          pass: false,
          message: () => 'The data is valid',
        }
      } catch (e) {
        const error = e as EntityValidationError
        const isMatch = objectContaining(received).asymmetricMatch(error.error);
        return isMatch
          ? { pass: true, message: () => '' }
          : { pass: false, message: () => `The validation errors not contains ${JSON.stringify(
            received
          )}. Current: ${JSON.stringify(error.error)}` };
      }
    } else {
      const isValid = expected.validator.validate(expected.data);

    if (isValid) {
      return {
        message: () => 'The received object is valid',
        pass: false
      };
    }

    const isMatch = objectContaining(received).asymmetricMatch(expected.validator.errors);
    return isMatch
      ? { pass: true, message: () => '' }
      : { pass: false, message: () => `The validation errors not contains ${JSON.stringify(
        received
      )}. Current: ${JSON.stringify(expected.validator.errors)}` };
    }
  }
})
