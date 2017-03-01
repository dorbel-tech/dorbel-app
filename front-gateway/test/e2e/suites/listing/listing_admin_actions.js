var home,
  newApartmentForm,
  listing,
  listingId;

function login(isAdmin = false) {
  home.navigate().signInAsTestUser(isAdmin);
}

function logout() {
  home.signOut();
}

function submitApartment() {
  newApartmentForm
    .fillAndSubmitNewApartmentForm()
    .expect.section('@successModal').to.be.visible;
  newApartmentForm.section.successModal
    .waitForText('@successTitle', (text) => ( text === 'העלאת הדירה הושלמה!' ));
  // Get listingId from sucess modal dom element data-attr attribute.
  newApartmentForm.section.successModal.getAttribute('@listingId', 'data-attr', function(result) {
    listingId = result.value;
  });
}

module.exports = {
  beforeEach: function (browser) {
    home = browser.page.home();
    home.resizeDesktop(browser);
    newApartmentForm = browser.page.new_apartment_form();
    listing = browser.page.listing();
  },
  'should submit a new apartment': function (browser) {
    login(); // Login as Landlord
    submitApartment();
    browser.end();
  },
  'should approve apartment': function (browser) {
    login(true); // Login as Admin
    listing
      .navigateToListingPage(listing.url(listingId))
      .expect.section('@landlordControls').to.be.visible;
    listing.changeListingStatus('listed');
    logout();
    browser.refresh();
    listing.expect.section('@listingTitle').to.be.visible;
    browser.end();
  }    
};
