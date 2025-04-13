# Snake Game

A simple Snake game built with React, TypeScript, and Supabase for the leaderboard.

## Features

- Classic Snake gameplay
- Score tracking
- Global leaderboard using Supabase
- Pause functionality
- Responsive design

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Supabase project and set up a table called `scores` with the following columns:
   - `id` (auto-incrementing primary key)
   - `player_name` (text)
   - `score` (integer)
   - `created_at` (timestamp with timezone)

4. Create a `.env` file in the root directory with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## How to Play

- Use arrow keys to control the snake
- Press space to pause the game
- Try to eat the food (red dots) to grow and increase your score
- Avoid hitting the walls or yourself
- When game over, your score will be automatically submitted to the leaderboard

## Technologies Used

- React
- TypeScript
- Vite
- Supabase
- CSS
