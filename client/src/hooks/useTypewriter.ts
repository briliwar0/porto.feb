import { useState, useEffect } from 'react';

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

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    const handleTyping = () => {
      const currentWord = words[wordIndex];
      
      if (isDeleting) {
        // Deleting text
        setText(current => current.substring(0, current.length - 1));
        
        // When fully deleted, move to next word
        if (text === '') {
          setIsDeleting(false);
          setWordIndex((prev) => {
            if (prev === words.length - 1) {
              return loop ? 0 : prev;
            }
            return prev + 1;
          });
        }
      } else {
        // Typing text
        setText(current => {
          const nextText = currentWord.substring(0, current.length + 1);
          return nextText;
        });
        
        // When word is complete, prepare to delete after delay
        if (text === currentWord) {
          timer = setTimeout(() => {
            setIsDeleting(true);
          }, delayBetweenWords);
          return;
        }
      }
      
      // Schedule next update
      const speed = isDeleting ? deleteSpeed : typeSpeed;
      timer = setTimeout(handleTyping, speed);
    };

    // Start the effect with a short delay
    timer = setTimeout(handleTyping, 500);
    
    // Cleanup
    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, words, loop, typeSpeed, deleteSpeed, delayBetweenWords]);

  return text;
};

export default useTypewriter;
