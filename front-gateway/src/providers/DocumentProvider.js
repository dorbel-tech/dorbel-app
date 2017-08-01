'use strict';
const DOCUMENTS_ROUTE = '/api/apartments/v1/documents';
const FILESTACK = 'filestack';

export default class DocumentProvider {
  constructor(appStore, apiProvider) {
    this.appStore = appStore;
    this.api = apiProvider;
  }

  getDocumentsForListing(listing_id) {
    return this.api.fetch(DOCUMENTS_ROUTE + '?listing_id=' + listing_id)
      .then(documents => this.appStore.documentStore.add(documents));
  }

  saveDocument(listing_id, file) {
    const data = {
      listing_id,
      provider: FILESTACK,
      provider_file_id: file.handle,
      filename: file.filename,
      type: file.mimetype,
      size: file.size
    };

    return this.api.fetch(DOCUMENTS_ROUTE, { method: 'POST', data })
      .then(document => this.appStore.documentStore.add([ document ]));
  }

  getDownloadLink(document) {
    if (document.provider === FILESTACK) {
      return 'https://www.filestackapi.com/api/file/' + document.provider_file_id;
    } else {
      throw new Error('unknown file provider');
    }
  }

  deleteDocument(document) {
    // backend should also remove file from filestack
    return this.api.fetch(DOCUMENTS_ROUTE + '/' + document.id, { method: 'DELETE' })
      .then(() => this.appStore.documentStore.remove(document));
  }
}
