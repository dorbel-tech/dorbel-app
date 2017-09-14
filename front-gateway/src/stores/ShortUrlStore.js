import { observable } from 'mobx';
export default class ShortUrlStore {
  constructor() {
    this.longToShortUrlMap = {}
  }

  get(longUrl) {
    return this.longToShortUrlMap[longUrl]
  }

  set(longUrl, shortUrl) {
    this.longToShortUrlMap[longUrl] = shortUrl;
  }
}
