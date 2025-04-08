import { useState, useEffect, useCallback } from 'react';

interface TypewriterOptions {
  words: string[];
  loop?: boolean;
  typeSpeed?: number;
  deleteSpeed?: number;
  delayBetweenWords?: number;
}

export const useTypewriter = ({
  words,
  loop = true,
  typeSpeed = 100,
  deleteSpeed = 50,
  delayBetweenWords = 2000,
}: TypewriterOptions) => {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const type = useCallback(() => {
    const currentWord = words[wordIndex];
    const shouldDelete = isDeleting;

    setText((prev) => {
      if (shouldDelete) {
        return prev.substring(0, prev.length - 1);
      } else {
        return currentWord.substring(0, prev.length + 1);
      }
    });

    if (!shouldDelete && text === currentWord) {
      // Start deleting after delay
      setTimeout(() => setIsDeleting(true), delayBetweenWords);
    } else if (shouldDelete && text === '') {
      setIsDeleting(false);
      // Move to next word or loop back
      setWordIndex((prev) => {
        if (prev === words.length - 1) {
          return loop ? 0 : prev;
        }
        return prev + 1;
      });
    }

    const speed = isDeleting ? deleteSpeed : typeSpeed;
    setTimeout(type, speed);
  }, [delayBetweenWords, isDeleting, loop, text, typeSpeed, deleteSpeed, wordIndex, words]);

  useEffect(() => {
    const timeout = setTimeout(type, 1000);
    return () => clearTimeout(timeout);
  }, [type]);

  return text;
};

export default useTypewriter;
