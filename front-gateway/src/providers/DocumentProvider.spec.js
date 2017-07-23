'use strict';
import faker from 'faker';
import DocumentProvider from './DocumentProvider.js';

describe('Document Provider', () => {
  let documentProvider, appStoreMock, apiProviderMock;

  beforeEach(() => {
    appStoreMock = {
      documentStore: {
        add: jest.fn(),
        remove: jest.fn()
      }
    };
    apiProviderMock = {
      fetch: jest.fn()
    };
    documentProvider = new DocumentProvider(appStoreMock, apiProviderMock);
  });

  it('should get documents for listing and put them in store', () => {
    const listing_id = faker.random.number({ min: 1, max: 999 });
    const mockDocuments = [ { abc: 123 } ];
    apiProviderMock.fetch.mockReturnValue(Promise.resolve(mockDocuments));

    return documentProvider.getDocumentsForListing(listing_id)
    .then(() => {
      expect(apiProviderMock.fetch.mock.calls[0][0]).toContain('listing_id=' + listing_id);
      expect(appStoreMock.documentStore.add).toHaveBeenCalledWith(mockDocuments);
    });
  });

  it('should get all documents for user and put them in store', () => {
    const mockDocuments = [ { def: 456 } ];
    apiProviderMock.fetch.mockReturnValue(Promise.resolve(mockDocuments));

    return documentProvider.getAllDocumentsForUser()
    .then(() => {
      expect(apiProviderMock.fetch.mock.calls[0][0]).toEqual('/api/apartments/v1/documents');
      expect(appStoreMock.documentStore.add).toHaveBeenCalledWith(mockDocuments);
    });
  });

  it('should save document to API and add it to store', () => {
    const listing_id = faker.random.number({ min: 1, max: 999 });
    const mockNewDocument = { filename: 'shoes' };
    const mockSavedDocument = { soap: 'bar' };
    apiProviderMock.fetch.mockReturnValue(Promise.resolve(mockSavedDocument));

    return documentProvider.saveDocument(listing_id, mockNewDocument)
    .then(() => {
      const apiCallArgs = apiProviderMock.fetch.mock.calls[0];
      expect(apiCallArgs[1].method).toBe('POST');
      expect(apiCallArgs[1].data).toMatchObject(Object.assign({ listing_id }, mockNewDocument));
      expect(appStoreMock.documentStore.add).toHaveBeenCalledWith([ mockSavedDocument ]);
    });
  });

  it('should get download link for filestack provider', () => {
    const mockDocument = {
      provider: 'filestack',
      provider_file_id: faker.random.word()
    };

    const link = documentProvider.getDownloadLink(mockDocument);

    expect(link).toBe('https://www.filestackapi.com/api/file/' + mockDocument.provider_file_id);
  });

  it('should throw error when trying to get download link for other document provider', () => {
    expect(() => documentProvider.getDownloadLink({ provider: 'docs R us' })).toThrow();
  });

  it('should delete document from API and remove from store', () => {
    const mockDocument = { id: faker.random.number({ min: 1, max: 9999 }) };
    apiProviderMock.fetch.mockReturnValue(Promise.resolve());

    return documentProvider.deleteDocument(mockDocument)
    .then(() => {
      const apiCallArgs = apiProviderMock.fetch.mock.calls[0];
      expect(apiCallArgs[0]).toMatch(new RegExp(`documents/${mockDocument.id}$`));
      expect(apiCallArgs[1].method).toBe('DELETE');
      expect(appStoreMock.documentStore.remove).toHaveBeenCalledWith(mockDocument);
    });
  });
});
