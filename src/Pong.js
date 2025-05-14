import React, { useEffect, useRef, useState } from 'react';

const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 16;
const BALL_SIZE = 18;
const PADDLE_SPEED = 7;
const BALL_SPEED = 6;

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

export default function Pong({ onExit }) {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [paddleY, setPaddleY] = useState(window.innerHeight / 2 - PADDLE_HEIGHT / 2);
  const [robotY, setRobotY] = useState(window.innerHeight / 2 - PADDLE_HEIGHT / 2);
  const [ball, setBall] = useState({
    x: window.innerWidth / 2 - BALL_SIZE / 2,
    y: window.innerHeight / 2 - BALL_SIZE / 2,
    vx: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
    vy: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
  });
  const [score, setScore] = useState({ player: 0, robot: 0 });
  const [running, setRunning] = useState(true);
  const keys = useRef({});
  const frame = useRef();

  // Handle resize for fullscreen
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setRunning(false);
        if (onExit) onExit();
      }
      keys.current[e.key] = true;
    };
    const handleKeyUp = (e) => {
      keys.current[e.key] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onExit]);

  useEffect(() => {
    if (!running) return;
    function gameLoop() {
      // Player paddle
      setPaddleY((prev) => {
        let next = prev;
        if (keys.current['ArrowUp']) next -= PADDLE_SPEED;
        if (keys.current['ArrowDown']) next += PADDLE_SPEED;
        return clamp(next, 0, dimensions.height - PADDLE_HEIGHT);
      });
      // Robot paddle (simple AI follows the ball)
      setRobotY((prev) => {
        const center = prev + PADDLE_HEIGHT / 2;
        const target = ball.y + BALL_SIZE / 2;
        let next = prev;
        if (center < target - 10) next += PADDLE_SPEED * 0.85;
        else if (center > target + 10) next -= PADDLE_SPEED * 0.85;
        return clamp(next, 0, dimensions.height - PADDLE_HEIGHT);
      });
      // Ball
      setBall((prev) => {
        let { x, y, vx, vy } = prev;
        x += vx;
        y += vy;
        // Bounce off top/bottom
        if (y <= 0 || y + BALL_SIZE >= dimensions.height) {
          vy = -vy;
          y = clamp(y, 0, dimensions.height - BALL_SIZE);
        }
        // Player paddle collision
        if (
          x <= PADDLE_WIDTH &&
          y + BALL_SIZE > paddleY &&
          y < paddleY + PADDLE_HEIGHT &&
          vx < 0
        ) {
          vx = -vx * 1.05;
          x = PADDLE_WIDTH;
        }
        // Robot paddle collision
        if (
          x + BALL_SIZE >= dimensions.width - PADDLE_WIDTH &&
          y + BALL_SIZE > robotY &&
          y < robotY + PADDLE_HEIGHT &&
          vx > 0
        ) {
          vx = -vx * 1.05;
          x = dimensions.width - PADDLE_WIDTH - BALL_SIZE;
        }
        // Missed by player
        if (x < -BALL_SIZE) {
          vx = BALL_SPEED;
          vy = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
          x = dimensions.width / 2 - BALL_SIZE / 2;
          y = dimensions.height / 2 - BALL_SIZE / 2;
          setScore((s) => ({ ...s, robot: s.robot + 1 }));
        }
        // Missed by robot
        if (x > dimensions.width + BALL_SIZE) {
          vx = -BALL_SPEED;
          vy = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
          x = dimensions.width / 2 - BALL_SIZE / 2;
          y = dimensions.height / 2 - BALL_SIZE / 2;
          setScore((s) => ({ ...s, player: s.player + 1 }));
        }
        return { x, y, vx, vy };
      });
      frame.current = requestAnimationFrame(gameLoop);
    }
    frame.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(frame.current);
  }, [running, paddleY, robotY, ball, dimensions.height, dimensions.width]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      background: '#111',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      width: '100vw',
      height: '100vh',
      transition: 'background 0.3s',
    }}>
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        background: '#111',
      }} />
      {/* Player Paddle */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: paddleY,
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT,
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 2px 8px #0008',
      }} />
      {/* Robot Paddle */}
      <div style={{
        position: 'absolute',
        right: 0,
        top: robotY,
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT,
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 2px 8px #0008',
      }} />
      {/* Ball */}
      <div style={{
        position: 'absolute',
        left: ball.x,
        top: ball.y,
        width: BALL_SIZE,
        height: BALL_SIZE,
        background: '#fff',
        borderRadius: '50%',
        boxShadow: '0 2px 8px #0008',
      }} />
      {/* Center line */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: 0,
        width: 4,
        height: '100vh',
        background: 'repeating-linear-gradient(to bottom, #fff 0 16px, #111 16px 32px)',
        transform: 'translateX(-50%)',
        opacity: 0.25,
        zIndex: 1,
      }} />
      {/* Score */}
      <div style={{
        position: 'absolute',
        top: 32,
        left: '25vw',
        color: '#fff',
        fontSize: 48,
        fontWeight: 900,
        letterSpacing: 2,
        textShadow: '0 2px 8px #0008',
        userSelect: 'none',
      }}>{score.player}</div>
      <div style={{
        position: 'absolute',
        top: 32,
        right: '25vw',
        color: '#fff',
        fontSize: 48,
        fontWeight: 900,
        letterSpacing: 2,
        textShadow: '0 2px 8px #0008',
        userSelect: 'none',
      }}>{score.robot}</div>
      {/* Instructions */}
      <div style={{
        position: 'absolute',
        bottom: 32,
        left: 0,
        width: '100vw',
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
        opacity: 0.7,
        userSelect: 'none',
      }}>Use ↑ and ↓ to move. Press Esc to exit.</div>
    </div>
  );
} 