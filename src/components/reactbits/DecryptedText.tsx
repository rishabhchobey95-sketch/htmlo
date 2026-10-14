import React, { useState, useEffect, useRef, useCallback } from 'react';

interface DecryptedTextProps {
  text: string;
  speed?: number; // ms between scrambles
  maxIterations?: number;
  className?: string;
  characters?: string;
  animateOnHover?: boolean;
}

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><,./-=';

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 30,
  maxIterations = 10,
  className = '',
  characters = DEFAULT_CHARS,
  animateOnHover = false,
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const startScramble = useCallback(() => {
    let iteration = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    setIsScrambling(true);

    intervalRef.current = window.setInterval(() => {
      setDisplayText(() =>
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration / (maxIterations / text.length)) {
              return text[index];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('')
      );

      if (iteration >= maxIterations) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsScrambling(false);
      }

      iteration += 1;
    }, speed);
  }, [text, speed, maxIterations, characters]);

  useEffect(() => {
    if (!animateOnHover) {
      const timer = window.setTimeout(() => {
        startScramble();
      }, 0);
      return () => {
        clearTimeout(timer);
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [animateOnHover, startScramble]);

  return (
    <span
      onMouseEnter={animateOnHover ? startScramble : undefined}
      className={`font-mono ${isScrambling ? 'text-indigo-400' : ''} ${className}`}
    >
      {displayText}
    </span>
  );
};
