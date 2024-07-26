import * as constants from '../constants';

describe('Hello world example keys and body', () => {
  test('Should validate the constants to be defined', () => {
    expect(constants.EXAMPLE_KEY_FIRST_PART).toBeDefined();
    expect(constants.EXAMPLE_KEY_SECOND_PART).toBeDefined();
    expect(constants.EXAMPLE_BODY).toBeDefined();
  });
});
