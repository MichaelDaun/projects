import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

export class BaseScraper {
  #baseUrl
  #sessionCookie

  getBaseLink () {
    return this.#baseUrl
  }

  setBaseUrl (baseUrl) {
    this.#baseUrl = baseUrl
  }

  setSessionCookie (cookie) {
    if (cookie) {
      // cut out the important part of the cookie
      this.#sessionCookie = cookie.split(';')[0]
    }
  }

  getSessionCookie () {
    return this.#sessionCookie
  }

  async updateSessionCookie () {
    if (this.#baseUrl) {
      const response = await fetch(this.#baseUrl)
      this.setSessionCookie(response.headers.get('set-cookie'))
    }
  }

  async findResourceLink (nameOfResource, url) {
    const response = await fetch(url)

    // Update cookies if they are included in response
    this.setSessionCookie(response.headers.get('set-cookie'))
    const data = await response.text()

    const $ = cheerio.load(data)
    // Find link to correct resource
    const anchors = $('a').toArray()

    for (const anchor of anchors) {
      const resourceLink = $(anchor).attr('href')
      if (resourceLink && resourceLink.toLowerCase().includes(nameOfResource)) {
        if (!this.#baseUrl) {
          this.#baseUrl = resourceLink
        }
        return resourceLink
      }
    }

    // Resource not found in loop return null
    return null
  }
}
