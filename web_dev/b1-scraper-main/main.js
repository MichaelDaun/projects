import chalk from 'chalk'
import { CalendarScraper } from './src/CalendarScraper.js'
import { DinnerScraper } from './src/DinnerScraper.js'
import { CinemaScraper } from './src/CinemaScraper.js'

const args = process.argv.slice(2)
// Check args
if (args.length !== 1) {
  console.log(`${chalk.red('Incorrect')} number of arguments provided`)
  console.log(`Application needs ${chalk.green('1')} argument which should be the ${chalk.green('base url')}`)
  console.log(`${chalk.magenta('Exiting Application')}`)
  process.exit()
}

/* // manually set args for easier debug sessions
const args = ['https://courselab.lnu.se/scraper-site-2/'] */

const username = 'zeke'
const password = 'coys'

const calendarScraper = new CalendarScraper()
const dinnerScraper = new DinnerScraper(username, password)
const cinemaScraper = new CinemaScraper()
let availableDays = []
let availableMovieScreenings = []
let availableDinnerReservations = []

/**
 * Initiates scrapers to gather available days, movie screenings, and dinner reservations.
 */
async function initiateScrapers () {
  try {
    // Start with finding links to correct resources
    process.stdout.write(chalk.magenta('Scraping') + ' links...')
    if (await calendarScraper.findResourceLink('calendar', args[0]) &&
await cinemaScraper.findResourceLink('cinema', args[0]) &&
await dinnerScraper.findResourceLink('dinner', args[0])) {
      console.log(chalk.green('OK'))
    } else {
      throw new Error('Failed to scrape links')
    }
    // Process available dates
    process.stdout.write(chalk.magenta('Scraping') + ' available days...')
    if (await calendarScraper.scrapeCalendarData()) {
      availableDays = calendarScraper.getAvailableDays()
      console.log(chalk.green('OK'))
    } else {
      throw new Error('Failed to scrape available days')
    }

    // Process available Cinema screenings
    process.stdout.write(chalk.magenta('Scraping') + ' available movie screenings...')
    if (await cinemaScraper.scrapeCinemaData(availableDays)) {
      availableMovieScreenings = cinemaScraper.getAvailableMovieScreenings()
      console.log(chalk.green('OK'))
    } else {
      throw new Error('Failed to scrape available movie screenings')
    }

    // Process available dinner reservations
    process.stdout.write(chalk.magenta('Scraping') + ' available dinner reservations...')
    if (await dinnerScraper.scrapeDinnerData(availableDays)) {
      availableDinnerReservations = dinnerScraper.getAvailableDinnerReservations()
      console.log(chalk.green('OK'))
    } else {
      throw new Error('Failed to scrape available dinner reservations')
    }

    presentRecommendations()
  } catch (error) {
    console.log(chalk.red(`${error.message}`))
    console.log('Exiting Application')
    process.exit(1)
  }
}

/**
 * Finds and presents movie and dinner recommendations based on availability.
 */
function presentRecommendations () {
  const recommendations = {}
  console.log(`\n${chalk.blue('Recommendations')}\n===============`)

  // Check if its possible at all to get any recommendations
  if (
    availableDays.length === 0 ||
    Object.keys(availableMovieScreenings).length === 0 ||
    Object.keys(availableDinnerReservations).length === 0
  ) {
    console.log(`${chalk.red('Could not find any recommendations for this week.')}`)
    return
  }

  // We go through each day (key) as we know that is the common factor for our recommendations
  for (const day of availableDays) {
    const moviesCurrentDay = availableMovieScreenings[day]
    const dinnerReservationsCurrentDay = availableDinnerReservations[day]

    // A more solid solution would probably be to convert to Date Objects
    // But in the scope of this assignment this should work.
    for (const movie of moviesCurrentDay) {
      const movieStart = parseInt(movie.time.split(':')[0])
      const earliestDinnerTime = movieStart + 2

      const possibleDinnerReservation = dinnerReservationsCurrentDay.find(dinnerSlot => {
        const dinnerStart = parseInt(dinnerSlot.split(' - ')[0])
        return dinnerStart >= earliestDinnerTime
      })

      // If we have a possibleDinnerReservation for given day and movie we
      // Add the whole package to our recommendations list
      if (possibleDinnerReservation) {
        // Check if this is first recommendation for given day
        if (!recommendations[day]) {
          recommendations[day] = []
        }
        recommendations[day].push({
          title: movie.title,
          movieStarts: movie.time,
          dinnerTime: possibleDinnerReservation
        })
      }
    }
  }

  if (Object.keys(recommendations).length > 0) {
    for (const day in recommendations) {
      recommendations[day].forEach(entry => {
        console.log(`* ${chalk.blue(`On ${day}`)} the movie ${chalk.yellow(`"${entry.title}"`)} starts at ${chalk.magenta(`${entry.movieStarts}`)} and there is a free table between ${chalk.green(`${entry.dinnerTime}`)}.`)
      })
    }
  } else {
    console.log(`${chalk.red('Could not find any recommendations for this week')}`)
  }
}

initiateScrapers()
