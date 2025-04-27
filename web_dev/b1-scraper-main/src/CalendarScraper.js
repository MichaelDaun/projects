import { BaseScraper } from './BaseScraper.js'
import * as cheerio from 'cheerio'

export class CalendarScraper extends BaseScraper {
  #personalCalendars
  #calendarLinksAndNames
  #availableDays
  #names
  constructor (names = ['paul', 'peter', 'mary']) {
    super()
    this.#calendarLinksAndNames = {}
    this.#names = names
    this.#personalCalendars = {}
  }

  getAvailableDays () {
    return this.#availableDays
  }

  async scrapeCalendarData () {
    try {
      // Start with getting the calendar links for each name
      await this.scrapeCalendarLinks()
      // We fetch each persons calendar
      await this.getPersonalCalendars()
      // Check if there are common days when when every is available
      this.checkAvailability()
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  async scrapeCalendarLinks () {
    for (const name of this.#names) {
      const nameResource = await this.findResourceLink(name, this.getBaseLink())
      const url = new URL(nameResource, this.getBaseLink()).href
      this.#calendarLinksAndNames[name] = url
    }
  }

  checkAvailability () {
    const days = ['Friday', 'Saturday', 'Sunday']
    // Filter with a mask that gives true when every person has 'ok' for given day
    this.#availableDays = days.filter(day =>
      Object.values(this.#personalCalendars).every(person => person[day] === 'ok'))
  }

  async getPersonalCalendars () {
    for (const [name, url] of Object.entries(this.#calendarLinksAndNames)) {
      const response = await fetch(url)
      const data = await response.text()
      const calendarDaysAndStatus = {}
      const $ = cheerio.load(data)
      const tableKeys = $('thead th').map((index, key) =>
        $(key).text().trim()).get()
      const tableValues = $('tbody td').map((index, value) =>
        $(value).text().trim()).get()

      let index = 0
      for (const key of tableKeys) {
        calendarDaysAndStatus[key] = tableValues[index]?.toLowerCase() || 'unknown'
        index += 1
      }

      this.#personalCalendars[name] = calendarDaysAndStatus
    }
  }
}
