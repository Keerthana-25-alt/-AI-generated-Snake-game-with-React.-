import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, RefreshCcw, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 120;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [highScore, setHighScore] = useState(0);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      const newSnake = [...snake];
      const head = { ...newSnake[0] };
      head.x += direction.x;
      head.y += direction.y;

      if (
        head.x < 0 || head.x >= GRID_SIZE ||
        head.y < 0 || head.y >= GRID_SIZE ||
        newSnake.some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        if (score > highScore) setHighScore(score);
        return;
      }

      newSnake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 1);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const interval = setInterval(moveSnake, SPEED);
    return () => clearInterval(interval);
  }, [snake, direction, food, gameOver, isPaused, generateFood, score, highScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#ff00ff' : '#00ffff';
      ctx.fillRect(segment.x * cellSize + 1, segment.y * cellSize + 1, cellSize - 2, cellSize - 2);
      
      if (isHead) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(segment.x * cellSize + 2, segment.y * cellSize + 2, cellSize - 4, cellSize - 4);
      }
    });

    // Draw food
    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(food.x * cellSize + 4, food.y * cellSize + 4, cellSize - 8, cellSize - 8);
    
    // Scanlines effect on canvas
    ctx.fillStyle = 'rgba(0, 255, 255, 0.05)';
    for (let i = 0; i < canvas.height; i += 4) {
      ctx.fillRect(0, i, canvas.width, 1);
    }
  }, [snake, food]);

  return (
    <div className="relative border-4 border-magenta bg-black p-4 font-mono shadow-[0_0_20px_rgba(255,0,255,0.5)]">
      <div className="mb-4 flex items-center justify-between border-b-2 border-cyan pb-2">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-magenta">DATA_STREAM_SCORE</span>
          <span className="text-2xl font-bold text-cyan">{score.toString().padStart(3, '0')}</span>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-cyan text-cyan hover:bg-cyan hover:text-black rounded-none"
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? 'INIT' : 'HALT'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-magenta text-magenta hover:bg-magenta hover:text-black rounded-none"
            onClick={resetGame}
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative aspect-square w-full max-w-[400px] border-2 border-cyan">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="h-full w-full grayscale-[0.5] contrast-[1.2]"
        />

        <AnimatePresence>
          {(gameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-[2px]"
            >
              {gameOver ? (
                <>
                  <h2 className="glitch-text mb-4 text-3xl font-black uppercase text-magenta" data-text="SYSTEM_FAILURE">SYSTEM_FAILURE</h2>
                  <p className="mb-6 text-cyan">RECOVERY_KEY: {score}</p>
                  <Button 
                    className="bg-magenta px-8 py-4 font-bold uppercase text-black hover:bg-cyan transition-colors rounded-none"
                    onClick={resetGame}
                  >
                    REBOOT_CORE
                  </Button>
                </>
              ) : (
                <>
                  <h2 className="glitch-text mb-6 text-3xl font-black uppercase text-cyan" data-text="LINK_SUSPENDED">LINK_SUSPENDED</h2>
                  <Button 
                    className="bg-cyan px-8 py-4 font-bold uppercase text-black hover:bg-magenta transition-colors rounded-none"
                    onClick={() => setIsPaused(false)}
                  >
                    RESUME_UPLINK
                  </Button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex justify-between text-[10px] uppercase text-cyan/60">
        <span>INPUT: ARROW_KEYS</span>
        <span>STATUS: {gameOver ? 'CRITICAL' : isPaused ? 'IDLE' : 'ACTIVE'}</span>
      </div>
    </div>
  );
}

