# A2 Quiz Application

![Santa](/src/img/santa_logo.webp)

This quiz application is a fast-paced single-page game where users answer questions fetched dynamically from a server. Built with JavaScript and designed for seamless play, the game features a responsive interface, keyboard navigation, and a high score system to track the best performances.

## Getting Started

To get the application up and running, follow these steps:

1. **Clone the repository**:

  ```bash
  git clone git@gitlab.lnu.se:1dv528/student/md222fx/a2-quiz.git
  
  cd a2-quiz
  ```

2. **Install dependencies**:
  ```bash
  npm install
  ````
3. **Build the quiz app**:
  ```bash
  npm run build
  ````
4. **Run the application from the `dist/` folder**:
  ```bash
  npm run http-server dist
  ```

5. **Open http://localhost:9001/ in your web browser**.

## Rules of the Game

1. **Objective**: Answer all questions correctly within the time limit. Each question must be answered within 10 seconds. If time runs out or an incorrect answer is provided, the game ends. Answer all questions correctly to see your total time and add your result to the high score list.
  
2. **Gameplay**:
- Use the keyboard for navigation and answering to maximize speed.
- Radio button questions allow you to select the answer with `1`, `2`, `3`, etc., and submit using `Enter`.
- For free-text answers, type your response and press `Enter` to submit.

## Running Linters

This command will check the code for style and syntax errors and output any issues.

```bash
  npm run lint
```
