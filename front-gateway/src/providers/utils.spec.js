'use strict';
import utils from './utils';

describe('Utils', () => {
  describe('Promise Series', () => {
    const fnResolves = (value) => jest.fn().mockReturnValue(Promise.resolve(value));

    it('should run promises in series and return all results', () => {
      const mockValues = [ 'abc', 123, { asSimpleAs: 'do re mi' } ];
      const functionsThatReturnsPromises = mockValues.map(fnResolves);

      return utils.promiseSeries(functionsThatReturnsPromises)
        .then(results => {
          functionsThatReturnsPromises.forEach(func => expect(func).toHaveBeenCalled());
          expect(results).toEqual(mockValues);
        });
    });

    it('should reject when a promise is rejected along the way', () => {
      const goodFunc = fnResolves();
      const error = new Error('these are not the droids you are looking for');
      const badFunc = jest.fn().mockReturnValue(Promise.reject(error));
      const wontBeCalledFunc = jest.fn();

      expect.assertions(4);

      return utils.promiseSeries([ goodFunc, badFunc, wontBeCalledFunc ])
        .then(() => {
          expect('this not').toBe('called');
        })
        .catch(caughtError => {
          expect(caughtError).toBe(error);
          expect(goodFunc).toHaveBeenCalled();
          expect(badFunc).toHaveBeenCalled();
          expect(wontBeCalledFunc).not.toHaveBeenCalled();
        });
    });
  });
});
