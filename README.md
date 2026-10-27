# BakaTest · Cloud Computing MCQ Practice Platform

A modern, distraction-free, exam-grade Cloud Computing MCQ practice web application built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS**.

The application consolidates all **377 verified questions** (268 classic questions from Assignment Weeks 1–12 and Mock Exams 1–5 + 109 new unique questions from 2025 Assignments), providing immediate feedback, detailed solutions, persistent local storage, custom timing modes, and a dedicated mistake retry engine.

---

## 🚀 Features

* **377 Verified Questions**: Extracted from authoritative source documents, preserving all options, answers, detailed explanations, and source references.
* **Examination Portal UI**: Clean, warm off-white layout with high contrast, legible typography, card-based question views, and an interactive right-hand answer sheet.
* **Flexible Practice Modes**:
  * Practice **2025 Questions Only** (109 Qs)
  * Practice **All Questions** (377 Qs)
  * Practice **Classic Bank Only** (268 Qs)
* **Immediate Feedback & Seamless Progression**:
  * Select an option and either check immediately or move to the next question with your answer recorded.
  * Correct choices highlighted in emerald green; incorrect choices highlight your selection in rose red and display the correct answer.
  * Detailed solutions and source lecture/exam citations.
* **Numbered Answer Sheet**: Compact sidebar grid representing all questions with status indicators (Unanswered, Selected, Correct, Incorrect, Skipped).
* **Dual Timer Support**:
  * **Elapsed Timer** (`HH:MM:SS` format) tracking total session time based on real timestamps.
  * **Countdown Timer** with preset intervals (10m, 25m, 50m, custom) with subtle 20% warning, urgent 1-minute alert, and auto-submission upon expiry.
* **Persistent Progress & LocalStorage**:
  * Versioned schema (`bakatest:v1`).
  * Practice sessions survive browser refresh.
  * Full mastery tracker records unique questions attempted, overall accuracy, completed sessions count, and total study duration.
* **Intelligent Retry Pool**:
  * Identifies questions where the latest attempt was incorrect.
  * Dedicated **Retry Incorrect Questions** session with Fisher-Yates shuffled order.
* **Keyboard Accessibility**:
  * `A` / `B` / `C` / `D`: Select option
  * `Enter`: Check Answer (or Next Question if already checked)
  * `→`: Next Question
  * `←`: Previous Question

---

## 🛠 Tech Stack

* **Frontend**: React 18, Vite 5, TypeScript 5
* **Styling**: Tailwind CSS, Lucide React Icons
* **Persistence**: Browser LocalStorage (`bakatest:v1`)
* **Testing**: Vitest, React Testing Library, JSDOM

---

## 💻 Getting Started Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Unit Tests
```bash
npm test
```

### 4. Build for Production
```bash
npm run build
```
The compiled, production-ready static assets will be output in the `dist/` directory.

---

## 🔒 Security & Privacy

* **Zero Backend / Serverless**: Runs completely in the client's browser.
* **No Telemetry / No Tracking**: No external analytics, third-party user tracking, or data collection.
* **No Secrets or Credentials**: All questions and logic operate entirely offline with zero API keys or external authentication tokens.
