import { BaseScraper } from './BaseScraper.js'
import * as cheerio from 'cheerio'

export class DinnerScraper extends BaseScraper {
  #password
  #username
  #availableReservations
  constructor (username, password) {
    super()
    this.#password = password
    this.#username = username
    this.#availableReservations = {}
  }

  getAvailableDinnerReservations () {
    return this.#availableReservations
  }

  convertToWeekday (dayID) {
    const toWeekday = {
      fri: 'Friday',
      sat: 'Saturday',
      sun: 'Sunday'
    }

    return toWeekday[dayID] || 'Unknown'
  }

  convertToTime (timeID) {
    const toCompleteTimeString = {
      1416: '14:00 - 16:00',
      1618: '16:00 - 18:00',
      1820: '18:00 - 20:00',
      2022: '20:00 - 22:00'
    }

    return toCompleteTimeString[timeID] || 'Unknown'
  }

  async scrapeDinnerData (daysToCheck) {
    try {
      // Start with logging in to dinner site and fetching data
      const dinnerData = await this.loginAndFetchData()
      // Now extract and format data
      this.extractDinnerData(dinnerData, daysToCheck)
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  async extractDinnerData (data, daysToCheck) {
    const $ = cheerio.load(data)

    const radioButtonData = $('input[type="radio"]').get()

    // Cheerio ignores the disabled radiobuttons, the entries we loop over are all available
    for (const entry of radioButtonData) {
      const day = this.convertToWeekday($(entry).attr('value').slice(0, 3))

      // Skip this day if its not in the dayToCheck
      if (!daysToCheck.includes(day)) {
        continue
      }

      const time = this.convertToTime($(entry).attr('value').slice(3))
      if (!this.#availableReservations[day]) {
        this.#availableReservations[day] = []
      }

      this.#availableReservations[day].push(time)
    }
  }

  async loginAndFetchData () {
    const loginUrl = this.getBaseLink() + 'login'
    const loginResponse = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: this.getSessionCookie()
      },
      body: `username=${this.#username}&password=${this.#password}`,
      redirect: 'manual'
    })

    if (loginResponse.status === 302) {
      // We have successfully been redirected, update cookie and follow
      this.setSessionCookie(loginResponse.headers.get('set-cookie'))
      const redirectLocation = loginResponse.headers.get('location')
      const finalResponse = await fetch((this.getBaseLink() + redirectLocation), {
        method: 'GET',
        headers: {
          Cookie: this.getSessionCookie()
        }
      })
      const data = await finalResponse.text()
      return data
    } else {
      throw new Error('Could not connect to Dinner site')
    }
  }
}
