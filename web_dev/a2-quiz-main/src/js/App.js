/**
 * @file App.js
 * @description Initializes the quiz application by creating an instance of the Quiz class
 * and starting the game. Acts as the main entry point for the application.
 */
import { Quiz } from './quiz'

const startingURL = 'https://courselab.lnu.se/quiz/question/1'
const quiz = new Quiz(startingURL)

quiz.startGame()
