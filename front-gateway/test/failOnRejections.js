process.on('unhandledRejection', function (error) {
  // this will fail the tests if there is an unhandled rejection warning
  throw error;
});
