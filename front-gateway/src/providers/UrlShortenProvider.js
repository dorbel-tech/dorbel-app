export default class UrlShortenProvider {
  constructor(apiProvider) {
    this.apiProvider = apiProvider;
  }

  shortenUrl(longUrl) {
    if (longUrl) {
      return this.fetch(`https://www.googleapis.com/urlshortener/v1/url?key=${process.env.GOOGLE_MAPS_API_KEY}`{
        method: 'POST',
        data: { longUrl }
      }).then((resp) => {
        return resp.id;
      });
    }
    else {
      return new Promise.reject('Invalid url')
    }
  }
}
