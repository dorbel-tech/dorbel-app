import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import ReactFilestack from 'filestack-react';

describe('Document Upload', () => {
  let props, DocumentUpload;

  beforeAll(() => {
    process.env.IS_CLIENT = true;
    DocumentUpload = require('./DocumentUpload').default;
  });

  afterAll(() => delete process.env.IS_CLIENT);

  beforeEach(() => {
    props = { 
      appStore: {
        authStore: {
          profile: {
            dorbel_user_id: faker.random.uuid()
          }
        }
      },
      appProviders: {
        documentProvider: {
          saveDocument: jest.fn()
        }
      },
      listing_id: faker.random.number({ min: 1, max: 999 })
    };
  });

  const documentUpload = () => shallow(<DocumentUpload.wrappedComponent {...props} />);

  it('should send filestack api key to react-filestack component', () => {
    const reactFileStack = documentUpload().find(ReactFilestack);
    expect(reactFileStack.prop('apikey')).toBe(process.env.FILESTACK_API_KEY);
  });

  it('should pass static upload options to the react-filestack component', () => {
    const reactFileStack = documentUpload().find(ReactFilestack);
    const options = reactFileStack.prop('options');

    expect(options.fromSources).toHaveLength(5);
    expect(options.disableTransformer).toBe(true);
    expect(options.maxFiles).toBe(10);
    expect(options.storeTo.location).toBe('s3');
    expect(options.storeTo.container).toBe('dorbel-user-documents');
  });

  it('should pass dynamic upload path to react-filestack component', () => {
    const reactFileStack = documentUpload().find(ReactFilestack);
    const options = reactFileStack.prop('options');
    const expectedPath = `${process.env.NODE_ENV}/${props.appStore.authStore.profile.dorbel_user_id}/${props.listing_id}/`;

    expect(options.storeTo.path).toBe(expectedPath);
  });

  it('should notify provider on upload success', () => {
    const mockFile = { shoes: 'blue' };
    const mockUploadResponse = { filesUploaded: [ mockFile ] };

    const reactFileStack = documentUpload().find(ReactFilestack);
    reactFileStack.simulate('success', mockUploadResponse);

    expect(props.appProviders.documentProvider.saveDocument).toHaveBeenCalledTimes(1);
    expect(props.appProviders.documentProvider.saveDocument).toHaveBeenCalledWith(props.listing_id, mockFile);
  });
});
