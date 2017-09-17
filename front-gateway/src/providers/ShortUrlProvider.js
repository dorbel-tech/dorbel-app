import axios from 'axios'; // Using axios instead of apiProvider because google doesn't like the Authorization header 

export default class ShortUrlProvider {
  constructor(appStore) {
    this.appStore = appStore;
  }

  get(longUrl) {
    const { shortUrlStore } = this.appStore;
    const cachedUrl = shortUrlStore.get(longUrl);

    if (cachedUrl) { return Promise.resolve(cachedUrl); }
    else {
      return axios({
        url: `https://www.googleapis.com/urlshortener/v1/url?key=${process.env.GOOGLE_MAPS_API_KEY}`,
        method: 'POST',
        data: { longUrl }
      }).then((resp) => {
        const shortUrl = resp.data.id;
        shortUrlStore.set(longUrl, shortUrl);
        return shortUrl;
      });
    }
  }
}