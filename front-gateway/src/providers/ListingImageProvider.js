/**
 * ListingImageProvider manages the images for uploaded/edited listings
 */
'use strict';
import { action } from 'mobx';

export default class ListingImageProvider {
  constructor(providers) {
    this.cloudinaryProvider = providers.cloudinary;
  }

  uploadImage(file, editedListingStore) {
    const imageStore = editedListingStore.formValues.images;
    const image = { complete: false, src: file.preview, progress: 0, display_order: imageStore.length > 0 ? 99 : 0};
    imageStore.push(image);

    const onProgress = action('image-upload-progress', e => {
      let storedImage = imageStore.find(img => img.src === image.src, imageStore.length - 1);
      storedImage.progress = e.lengthComputable ? (e.loaded / e.total) : 0;
    });

    return this.cloudinaryProvider.upload(file, onProgress)
    .then(action('image-upload-done', uploadedImage => {
      let storedImage = imageStore.find(img => img.src === image.src, imageStore.length - 1);
      storedImage.complete = true;
      storedImage.src = `https://res.cloudinary.com/dorbel/${uploadedImage.resource_type}/${uploadedImage.type}/v${uploadedImage.version}/${uploadedImage.public_id}.${uploadedImage.format}`;
      storedImage.delete_token = uploadedImage.delete_token;
      storedImage.secure_url = uploadedImage.secure_url;

      return uploadedImage;
    }))
    .catch(action(() => {
      imageStore.remove(image); // remove method is available as this is a mobx observable array
    }));
  }

  deleteImage(image, editedListingStore) {
    editedListingStore.formValues.images.remove(image);
    return this.cloudinaryProvider.deleteImage(image);
  }
}
