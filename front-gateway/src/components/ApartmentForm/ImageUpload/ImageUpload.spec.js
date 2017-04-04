import React from 'react';
import { shallow } from 'enzyme';

import ImageUpload from './ImageUpload';
import Dropzone from 'react-dropzone';
import CloudinaryImage from '~/components/CloudinaryImage/CloudinaryImage';
import { flushPromises } from '~/providers/utils';

describe('Image Upload', () => {
  let appStoreMock, appProvidersMock;

  beforeEach(() => {
    appStoreMock = {
      newListingStore: {
        formValues: {
          images: []
        }
      }
    };
    appProvidersMock = {
      listingsProvider: {
        uploadImage: jest.fn().mockReturnValue(Promise.resolve())
      }
    };
  });

  const imageUpload = (props) => shallow(<ImageUpload.wrappedComponent appStore={appStoreMock} appProviders={appProvidersMock} {...props}/>);

  it('should render dropzone', () => {
    const wrapper = imageUpload();
    expect(wrapper.find(Dropzone)).toHaveLength(1);
  });

  it('should not render images when store is empty', () => {
    const wrapper = imageUpload();
    expect(wrapper.find(CloudinaryImage)).toHaveLength(0);
  });

  it('should render complete images from store', () => {
    const image = { progress: 1, complete: true, src: 'asldfkjadlfjoij' };
    appStoreMock.newListingStore.formValues.images.push(image);

    const wrapper = imageUpload();

    const images = wrapper.find(CloudinaryImage);
    expect(images).toHaveLength(1);
    expect(images.first().props().src).toBe(image.src);
    expect(wrapper.find('.remove-image').exists()).toBe(true);
    expect(wrapper.find('.progress').exists()).toBe(false);
  });

  it('should render incomplete images from store', () => {
    const image = { progress: 0.6, complete: false, src: 'bvcmkjbhiuerhg' };
    appStoreMock.newListingStore.formValues.images.push(image);

    const wrapper = imageUpload();

    const images = wrapper.find(CloudinaryImage);
    expect(images).toHaveLength(1);
    expect(images.first().props().src).toBe(image.src);
    expect(wrapper.find('.remove-image').exists()).toBe(false);
    expect(wrapper.find('.progress').exists()).toBe(true);
  });

  it('should send uploaded files to provider', () => {
    const image = { abc: 123 };

    // calling method directly since it is called by DropZone™
    imageUpload().instance().onChooseFile([ image ]);

    expect(appProvidersMock.listingsProvider.uploadImage).toHaveBeenCalledWith(image);
  });

  it('should call onUploadStart and onUploadComplete', () => {
    const onUploadStart = jest.fn();
    const onUploadComplete = jest.fn();
    const deferred = Promise.defer();
    appProvidersMock.listingsProvider = {
      uploadImage: jest.fn().mockReturnValue(deferred.promise)
    };

    imageUpload({ onUploadComplete, onUploadStart }).instance().onChooseFile([ { abc: 456 } ]);

    expect(onUploadStart).toHaveBeenCalled();
    expect(onUploadComplete).not.toHaveBeenCalled();
    deferred.resolve();
    return flushPromises().then(() => expect(onUploadComplete).toHaveBeenCalled());
  });
});
