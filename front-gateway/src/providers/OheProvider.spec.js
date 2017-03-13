'use strict';
import OheProvider from './OheProvider.js';

describe('Ohe Provider', () => {
  let oheProvider;
  let oheStoreMock;
  let apiMock;

  beforeAll(() => {
    apiMock = {
      fetch: jest.fn().mockReturnValue(Promise.resolve())
    };
    oheStoreMock = {
      isListingLoaded: jest.fn().mockReturnValue(false),
      markListingsAsLoaded: jest.fn(),
      add: jest.fn()
    };

    oheProvider = new OheProvider({ oheStore: oheStoreMock }, apiMock);
  });

  afterEach(() => jest.resetAllMocks());

  describe('Load Listing Events', () => {
    it('should not call api on undefined input', () => {
      return oheProvider.loadListingEvents(undefined)
      .then(() => expect(apiMock.fetch).not.toHaveBeenCalled());
    });

    it('should not call api on empty array input', () => {
      return oheProvider.loadListingEvents([])
      .then(() => expect(apiMock.fetch).not.toHaveBeenCalled());
    });

    it('should call fetch with a single listing id and return results to store', () => {
      const ohes = [{ bla: 123 }];
      apiMock.fetch = jest.fn().mockReturnValue(Promise.resolve(ohes));

      return oheProvider.loadListingEvents(555)
      .then(() => {
        expect(apiMock.fetch).toHaveBeenCalledWith('/api/ohe/v1/events/by-listing/555', {});
        expect(oheStoreMock.add).toHaveBeenCalledWith(ohes);
        expect(oheStoreMock.markListingsAsLoaded).toHaveBeenCalledWith([ 555 ]);
      });
    });

    it('should not call api for listing that has already been loaded', () => {
      oheStoreMock.isListingLoaded.mockReturnValue(true);

      return oheProvider.loadListingEvents([])
      .then(() => expect(apiMock.fetch).not.toHaveBeenCalled());
    });

    it('should call fetch with multiple listings and return results to store', () => {
      const ids = [ 555, 666, 777];
      const ohes = [{ bla: 456 }];
      apiMock.fetch = jest.fn().mockReturnValue(Promise.resolve(ohes));

      return oheProvider.loadListingEvents(ids)
      .then(() => {
        expect(apiMock.fetch).toHaveBeenCalledWith('/api/ohe/v1/events/by-listing/' + ids.join(','), {});
        expect(oheStoreMock.add).toHaveBeenCalledWith(ohes);
        expect(oheStoreMock.markListingsAsLoaded).toHaveBeenCalledWith(ids);
      });
    });

    it('should add minDate to request params when only-future argument is true', () => {
      apiMock.fetch = jest.fn().mockReturnValue(Promise.resolve([]));
      const originalDate = Date;
      const constantDate = new Date();
      Date = () => constantDate; // eslint-disable-line no-global-assign

      return oheProvider.loadListingEvents(987, true)
      .then(() => {
        expect(apiMock.fetch).toHaveBeenCalledWith('/api/ohe/v1/events/by-listing/987', { params: { minDate: constantDate } });
        Date = originalDate; // eslint-disable-line no-global-assign
      });
    });

    it('should call fetch in batches of 5', () => {
      apiMock.fetch = jest.fn().mockReturnValue(Promise.resolve([]));
      const ids = [1,2,3,4,5,6,7,8,9];

      return oheProvider.loadListingEvents(ids)
      .then(() => {
        expect(apiMock.fetch).toHaveBeenCalledTimes(2);
        expect(apiMock.fetch).toHaveBeenCalledWith('/api/ohe/v1/events/by-listing/1,2,3,4,5', {});
        expect(apiMock.fetch).toHaveBeenCalledWith('/api/ohe/v1/events/by-listing/6,7,8,9', {});
        expect(oheStoreMock.add).toHaveBeenCalledWith([]);
        expect(oheStoreMock.markListingsAsLoaded).toHaveBeenCalledTimes(2);
        expect(oheStoreMock.markListingsAsLoaded).toHaveBeenCalledWith([1,2,3,4,5]);
        expect(oheStoreMock.markListingsAsLoaded).toHaveBeenCalledWith([6,7,8,9]);
      });
    });
  });
});
