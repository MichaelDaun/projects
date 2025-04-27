import * as cheerio from 'cheerio'
import { BaseScraper } from './BaseScraper.js'

export class CinemaScraper extends BaseScraper {
  #moviesAndID
  #availableMovieScreenings
  constructor () {
    super()
    this.#moviesAndID = {}
    this.#availableMovieScreenings = {}
  }

  getAvailableMovieScreenings () {
    return this.#availableMovieScreenings
  }

  convertWeekdaysToNumbers (arrayWithWeekdays) {
    const weekdayToNumber = {
      Monday: '01',
      Tuesday: '02',
      Wednesday: '03',
      Thursday: '04',
      Friday: '05',
      Saturday: '06',
      Sunday: '07'
    }

    return arrayWithWeekdays.map(day => weekdayToNumber[day] || '00')
  }

  convertNumberToWeekday (dayID) {
    const numberToWeekday = {
      '01': 'Monday',
      '02': 'Tuesday',
      '03': 'Wednesday',
      '04': 'Thursday',
      '05': 'Friday',
      '06': 'Saturday',
      '07': 'Sunday'
    }

    return numberToWeekday[dayID] || 'Unknown'
  }

  async scrapeCinemaData (daysToCheck) {
    try {
      // Prepare days to check by converting array with strings
      daysToCheck = this.convertWeekdaysToNumbers(daysToCheck)
      // Start with getting list of movies and their ids
      await this.fetchMovieNameAndId()
      // Fetch data and process it.
      await this.fetchAvailableMovieScreenings(daysToCheck)
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  async fetchAvailableMovieScreenings (daysToCheck) {
    // Make GET request with query parameters
    for (const day of daysToCheck) {
      for (const movieID in this.#moviesAndID) {
        const ajaxUrl = `check?day=${day}&movie=${movieID}`
        const response = await fetch(`${this.getBaseLink()}/${ajaxUrl}`)
        let data = await response.json()

        // Process the data and tie it neatly in an object
        data = this.processAndStoreData(data)
      }
    }
  }

  processAndStoreData (movieScreeningsArrayOfObjects) {
    for (const { status, day, time, movie } of movieScreeningsArrayOfObjects) {
      const dayName = this.convertNumberToWeekday(day)

      if (!this.#availableMovieScreenings[dayName]) {
        this.#availableMovieScreenings[dayName] = []
      }

      if (status === 1) {
        const title = this.#moviesAndID[movie]
        this.#availableMovieScreenings[dayName].push({ title, time })
      }
    }
  }

  async fetchMovieNameAndId () {
    const response = await fetch(this.getBaseLink())
    const data = await response.text()

    const $ = cheerio.load(data)

    // Fetch movie names and id from select list in DOM
    // Every option contains value and text
    $("select[name='movie'] option").each((index, option) => {
      const movieID = $(option).attr('value')
      const movieName = $(option).text().trim()

      // First option is not related to movie, sort it out here
      if (movieID.match(/^[0-9]+$/)) {
        this.#moviesAndID[movieID] = movieName
      }
    })

    return true
  }
}
