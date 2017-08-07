'use strict';
const shared = require('dorbel-shared');
const documentRepository = require('../apartmentsDb/repositories/documentRepository');
const listingRepository = require('../apartmentsDb/repositories/listingRepository');

const errors = shared.utils.domainErrors;
const userPermissions = shared.utils.user.permissions;

async function create(documentToCreate, user) {
  const listing = await getAndValidateListing(documentToCreate.listing_id, user);

  // in case document is created by admin, it's owner will be the listing publishing user
  documentToCreate.dorbel_user_id = listing.publishing_user_id;

  return documentRepository.create(documentToCreate);
}

async function getByListingId(listing_id, user) {
  await getAndValidateListing(listing_id, user);
  return documentRepository.find({ listing_id });
}

function getByUser(user) {
  return documentRepository.find({ dorbel_user_id: user.id });
}

async function destroy(document_id, user) {
  const document = await documentRepository.findById(document_id);

  if (!document) {
    throw new errors.DomainNotFoundError('document not found', { document_id }, 'document not found');
  } else if (!userPermissions.isResourceOwnerOrAdmin(user, document.dorbel_user_id)) {
    throw new errors.NotResourceOwnerError();
  }

  // We are not deleting the file from filestack because that requires a signed signature, which we are not using (yet!)
  // TODO : delete file from filestack

  return documentRepository.destroy(document_id);
}

async function getAndValidateListing(listing_id, user) {
  const listing = await listingRepository.getById(listing_id);

  if (!listing) {
    throw new errors.DomainNotFoundError('listing not found', { listing_id }, 'listing not found');
  } else if (!userPermissions.isResourceOwnerOrAdmin(user, listing.publishing_user_id)) {
    throw new errors.NotResourceOwnerError();
  }

  return listing;
}

module.exports = {
  create,
  getByListingId,
  getByUser,
  destroy
};
