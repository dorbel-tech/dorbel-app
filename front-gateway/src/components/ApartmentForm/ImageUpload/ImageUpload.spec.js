import React from 'react';
import { shallow } from 'enzyme';

import ImageUpload from './ImageUpload';
import Dropzone from 'react-dropzone';
import CloudinaryImage from '~/components/CloudinaryImage/CloudinaryImage';
import { ProgressBar } from 'react-bootstrap';
import { flushPromises } from '~/providers/utils';

describe('Image Upload', () => {
  let editedListingStoreMock, appProvidersMock;

  beforeEach(() => {
    editedListingStoreMock = {
      uploadMode: 'publish',
      disableSave: jest.fn(),
      formValues: {
        images: []
      }
    };
    appProvidersMock = {
      listingImageProvider: {
        uploadImage: jest.fn().mockReturnValue(Promise.resolve()),
        deleteImage: jest.fn()
      }
    };
  });

  const imageUpload = (props) => shallow(<ImageUpload.wrappedComponent editedListingStore={editedListingStoreMock} appProviders={appProvidersMock} {...props} />);

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
    editedListingStoreMock.formValues.images.push(image);

    const wrapper = imageUpload();

    const images = wrapper.find(CloudinaryImage);
    expect(images).toHaveLength(1);
    expect(images.first().props().src).toBe(image.src);
    expect(wrapper.find('.remove-image').exists()).toBe(true);
    expect(wrapper.find(ProgressBar).exists()).toBe(false);
  });

  it('should render incomplete images from store', () => {
    const image = { progress: 0.6, complete: false, src: 'bvcmkjbhiuerhg' };
    editedListingStoreMock.formValues.images.push(image);

    const wrapper = imageUpload();
    const progressBar = wrapper.find(ProgressBar);

    const images = wrapper.find(CloudinaryImage);
    expect(images).toHaveLength(1);
    expect(images.first().props().src).toBe(image.src);
    expect(wrapper.find('.remove-image').exists()).toBe(false);
    expect(progressBar.exists()).toBe(true);
    expect(progressBar.props().now).toBe(60);
  });

  it('should send uploaded files to provider', () => {
    const image = { abc: 123 };

    // calling method directly since it is called by DropZone™
    imageUpload().instance().onChooseFile([image]);

    expect(appProvidersMock.listingImageProvider.uploadImage).toHaveBeenCalledWith(image, editedListingStoreMock);
  });

  it('should send deleted images to provider', () => {
    const image = { progress: 1, complete: true, src: 'asdfoiweflknasf' };
    editedListingStoreMock.formValues.images.push(image);

    const wrapper = imageUpload();
    wrapper.find('.remove-image').simulate('click');
    expect(appProvidersMock.listingImageProvider.deleteImage).toHaveBeenCalledWith(image, editedListingStoreMock);
  });
});
