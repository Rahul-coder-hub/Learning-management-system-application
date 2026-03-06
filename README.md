# LMS (Learning Management System) Setup Guide

> [!IMPORTANT]
> This project has been migrated to `C:\Users\Rahul\LMS` to resolve environment path issues (spaces and OneDrive integration). Both servers are currently running from that location.

This project consists of a Node.js/Express backend and a Next.js frontend.


## Prerequisites
- Node.js installed
- MySQL Server installed and running

## 1. Database Setup
1. Open your MySQL client (e.g., MySQL Workbench or terminal).
2. Run the commands in `schema.sql` to create the database and tables.
   ```bash
   mysql -u root -p < schema.sql
   ```

## 2. Backend Setup
1. Navigate to the `backend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env`.
   - Update `DB_PASSWORD` and other variables if necessary.
4. Start the server:
   ```bash
   npm start
   ```
   (The server runs on `http://localhost:5000`)

## 3. Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   (The app runs on `http://localhost:3000`)

## 4. Usage
1. Open `http://localhost:3000` in your browser.
2. Register a new account.
3. Login and browse courses.
4. Click "Start Learning" or "Open" a lesson to watch the YouTube video.
5. Watch the video and click "Mark as Completed" to unlock the next lesson.
