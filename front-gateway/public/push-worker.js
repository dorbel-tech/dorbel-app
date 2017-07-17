// 86acbd31cd7c09cf30acb66d2fbedc91daa48b86:1500280767.46
importScripts('https://web-sdk.urbanairship.com/notify/v1/ua-sdk.min.js')
uaSetup.worker(self, {
  // This  has a default of `/push-worker.js`. It should live at the root of
  // your domain. It only needs to be specified if your worker lives at a
  // different path.
  // workerUrl: '/push-worker.js',
  
  defaultIcon: 'https://static.dorbel.com/images/logo/dorbel\u002Dicon.png',
  defaultTitle: 'dorbel',
  defaultActionURL: 'https://www.dorbel.com',
  appKey: 'wA6xZuUJQyCLW55rXN8wew',
  token: 'MTp3QTZ4WnVVSlF5Q0xXNTVyWE44d2V3OkQ3bHVhckVOcE9MSHlOeFFiUUEyTlZwZEdYSXoxUDZfT2l0UklKeWw5Q0E',
  vapidPublicKey: 'BLRK2S505bmuoFrb2zNYk-5iVJZnX9rPbGPPdxoJhrrvlAI4Rr4OrbZOW7q5KOcfUo_a4baQhg_9g985MkIz8Hg='
})
