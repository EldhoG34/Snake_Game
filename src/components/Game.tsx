import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import './Game.css';

interface Position {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

const Game: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>([{ x: 5, y: 5 }]);
  const [food, setFood] = useState<Position>({ x: 10, y: 10 });
  const [direction, setDirection] = useState<string>('RIGHT');
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [showUsernameInput, setShowUsernameInput] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const gameLoopRef = useRef<NodeJS.Timeout>();

  const generateFood = (): Position => {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    return { x, y };
  };

  const moveSnake = () => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      // Check for collisions
      if (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE ||
        newSnake.some((segment) => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        setShowUsernameInput(true);
        return prevSnake;
      }

      newSnake.unshift(head);

      // Check if food is eaten
      if (head.x === food.x && head.y === food.y) {
        setFood(generateFood());
        setScore((prev) => prev + 10);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  };

  const submitScore = async () => {
    if (!username.trim()) {
      alert('Please enter a username!');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('scores')
        .insert([{ player_name: username.trim(), score }]);

      if (error) throw error;
      setShowUsernameInput(false);
      alert('Score submitted successfully!');
    } catch (err) {
      console.error('Error submitting score:', err);
      alert('Failed to submit score. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (showUsernameInput) return; // Disable game controls when username input is shown
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          setIsPaused((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, showUsernameInput]);

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, INITIAL_SPEED);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [direction, gameOver, isPaused]);

  const resetGame = () => {
    setSnake([{ x: 5, y: 5 }]);
    setFood(generateFood());
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    setShowUsernameInput(false);
    setUsername('');
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Snake Game</h1>
        <div className="score">Score: {score}</div>
        {isPaused && <div className="pause-message">PAUSED</div>}
      </div>
      <div
        className="game-board"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
        }}
      >
        {snake.map((segment, index) => (
          <div
            key={index}
            className="snake-segment"
            style={{
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
            }}
          />
        ))}
        <div
          className="food"
          style={{
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
          }}
        />
      </div>
      {gameOver && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Final Score: {score}</p>
          {showUsernameInput ? (
            <div className="username-input">
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={20}
              />
              <button 
                onClick={submitScore}
                disabled={isSubmitting || !username.trim()}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Score'}
              </button>
            </div>
          ) : (
            <button onClick={resetGame}>Play Again</button>
          )}
        </div>
      )}
      <div className="controls">
        <p>Controls: Arrow keys to move, Space to pause</p>
      </div>
    </div>
  );
};

export default Game; 