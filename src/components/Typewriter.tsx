import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface TypewriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

const Typewriter = ({ text, speed = 20, onComplete }: TypewriterProps) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText(''); // Reset on new text
    if (text) {
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setDisplayedText(text.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typingInterval);
          onComplete?.();
        }
      }, speed);

      return () => {
        clearInterval(typingInterval);
      };
    }
  }, [text, speed, onComplete]);

  return <ReactMarkdown>{displayedText}</ReactMarkdown>;
};

export default Typewriter;