"use client";

import React, { useEffect, useState, useRef } from "react";

export interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: "start" | "end" | "center";
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  encryptedClassName?: string;
  animateOn?: "mount" | "hover";
}

const DEFAULT_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=<>?/";

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 40,
  maxIterations = 10,
  sequential = true,
  revealDirection = "start",
  useOriginalCharsOnly = false,
  characters = DEFAULT_CHARS,
  className = "",
  encryptedClassName = "text-sky-400/80 font-mono",
  animateOn = "mount",
}) => {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isScrambling, setIsScrambling] = useState<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getAvailableChars = () => {
    if (useOriginalCharsOnly) {
      return Array.from(new Set(text.split(""))).filter((char) => char !== " ").join("");
    }
    return characters;
  };

  const getNextChar = (originalChar: string, availableChars: string) => {
    if (originalChar === " " || originalChar === "\n") return originalChar;
    const randomIndex = Math.floor(Math.random() * availableChars.length);
    return availableChars[randomIndex] || originalChar;
  };

  const startAnimation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsScrambling(true);

    const availableChars = getAvailableChars();
    const length = text.length;
    let iteration = 0;

    intervalRef.current = setInterval(() => {
      iteration++;

      setDisplayText(() => {
        return text
          .split("")
          .map((char, index) => {
            if (char === " " || char === "\n") return char;

            let shouldReveal = false;

            if (sequential) {
              if (revealDirection === "start") {
                const revealIndex = Math.floor((iteration / maxIterations) * length);
                shouldReveal = index < revealIndex;
              } else if (revealDirection === "end") {
                const revealIndex = length - Math.floor((iteration / maxIterations) * length);
                shouldReveal = index >= revealIndex;
              } else {
                // center
                const mid = Math.floor(length / 2);
                const spread = Math.floor((iteration / maxIterations) * (length / 2));
                shouldReveal = index >= mid - spread && index <= mid + spread;
              }
            } else {
              shouldReveal = iteration >= maxIterations;
            }

            if (shouldReveal || iteration >= maxIterations * 1.5) {
              return char;
            }

            return getNextChar(char, availableChars);
          })
          .join("");
      });

      if (iteration >= (sequential ? maxIterations * 1.5 : maxIterations)) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, speed);
  };

  useEffect(() => {
    if (animateOn === "mount") {
      startAnimation();
    } else {
      setDisplayText(text);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, animateOn]);

  const handleMouseEnter = () => {
    if (animateOn === "hover" && !isScrambling) {
      setIsHovering(true);
      startAnimation();
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <span
      className={`inline-block select-none ${isScrambling ? encryptedClassName : ""} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayText}
    </span>
  );
};

export default DecryptedText;
