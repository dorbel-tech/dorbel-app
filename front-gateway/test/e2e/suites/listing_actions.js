var home,
  newApartmentForm,
  listing,
  listingId;

function login(userType) {
  home.navigate().signInAsTestUser(userType);
}

function logout() {
  home.signOut();
}

function submitApartment() {
  newApartmentForm
    .fillAndSubmitNewApartmentForm()
    .expect.section('@successModal').to.be.visible;
  newApartmentForm.waitForSuccessText('העלאת הדירה הושלמה!' );
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
  'landlord should submit a new apartment': function (browser) {
    login('landlord');
    submitApartment();
    browser.end();
  },
  'admin should approve apartment': function (browser) {
    login('admin');
    listing.navigateToListingPage(listing.url(listingId));
    listing.expect.section('@landlordControls').to.be.visible;
    listing.changeListingStatus('listed');
    logout();
    browser.refresh();
    listing.expect.section('@listingTitle').to.be.visible;
    browser.end();
  },
  'tenant should register to OHE': function (browser) {
    login('tenant');
    listing.navigateToListingPage(listing.url(listingId));
    listing.waitForOheListText('הרשמו לביקור');
    listing.clickFirstOhe();
    listing.expect.section('@oheModal').to.be.visible;
    listing.fillOheRegisterUserDetailsAndSubmit();
    listing.waitForOheListText('נרשמתם לארוע זה. לחצו לביטול');
    browser.end();
  },
  'tenant should unregister from OHE': function (browser) {
    login('tenant');
    listing.navigateToListingPage(listing.url(listingId));
    listing.waitForOheListText('נרשמתם לארוע זה. לחצו לביטול');
    listing.clickFirstOhe();
    listing.expect.section('@oheModal').to.be.visible;
    listing.oheUnRegisterUser();
    browser.pause(300);
    listing.waitForOheListText('הרשמו לביקור');
    browser.end();
  },
  'tenant should follow to be notified for new OHE': function (browser) {
    login('tenant');
    listing.navigateToListingPage(listing.url(listingId));
    listing.waitForFollowOheText('קבלו עדכונים על מועדים עתידיים');
    listing.clickFollowOheButton();
    listing.expect.section('@followModal').to.be.visible;
    listing.followUserToOheUpdates();
    browser.pause(300);
    listing.waitForFollowOheText('לחצו להסרה מרשימת העדכונים');
    browser.end();
  },
  'tenant should unfollow to be notified of new OHE': function (browser) {
    login('tenant');
    listing.navigateToListingPage(listing.url(listingId));
    listing.waitForFollowOheText('לחצו להסרה מרשימת העדכונים');
    listing.clickFollowOheButton();
    listing.expect.section('@followModal').to.be.visible;
    listing.unFollowUserToOheUpdates();
    browser.pause(300);
    listing.waitForFollowOheText('קבלו עדכונים על מועדים עתידיים');
    browser.end();
  }
};
