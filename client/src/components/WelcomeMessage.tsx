import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { PERSONAL_INFO } from '@/lib/constants';
import { INSPIRATIONAL_QUOTES, Quote } from '@/lib/quotes';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Edit2, RefreshCcw } from 'lucide-react';
import LinuxLogo from './LinuxLogo';

const WelcomeMessage = () => {
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [userName, setUserName] = useState('Guest');
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [date, setDate] = useState('');
  const [quote, setQuote] = useState<Quote>(INSPIRATIONAL_QUOTES[0]);
  
  // Function to determine the appropriate greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good Afternoon';
    } else if (hour >= 17 && hour < 21) {
      return 'Good Evening';
    } else {
      return 'Good Night';
    }
  };
  
  // Function to format the current time
  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Function to format the current date
  const formatDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return now.toLocaleDateString(undefined, options);
  };
  
  // Function to get a random quote
  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length);
    return INSPIRATIONAL_QUOTES[randomIndex];
  };
  
  useEffect(() => {
    // Check if user name is saved in localStorage
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setUserName(savedName);
    }
    
    // Set initial values
    setGreeting(getGreeting());
    setCurrentTime(formatTime());
    setDate(formatDate());
    setQuote(getRandomQuote());
    
    // Update time and date every minute
    const intervalId = setInterval(() => {
      setGreeting(getGreeting());
      setCurrentTime(formatTime());
      setDate(formatDate());
    }, 60000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  const handleNameSubmit = () => {
    if (inputValue.trim()) {
      setUserName(inputValue);
      localStorage.setItem('userName', inputValue);
    }
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    }
  };
  
  return (
    <motion.div 
      className="mb-6 p-4 bg-white/5 dark:bg-dark/20 backdrop-blur-sm rounded-lg shadow-md"
      variants={fadeIn('down', 0.2)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-3">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            {greeting}, <span className="text-primary">{userName}</span>!
            {isEditing ? (
              <div className="flex items-center gap-1">
                <Input
                  className="w-32 h-8 py-1 text-sm bg-white/10 dark:bg-dark/30"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Your name"
                  autoFocus
                />
                <Button 
                  size="sm" 
                  className="h-8 px-2 bg-primary hover:bg-primary/90"
                  onClick={handleNameSubmit}
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-6 w-6 p-0 ml-2 rounded-full bg-white/10 dark:bg-dark/30"
                onClick={() => {
                  setInputValue(userName === 'Guest' ? '' : userName);
                  setIsEditing(true);
                }}
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            )}
          </h3>
          <p className="text-muted-foreground">
            Welcome to {PERSONAL_INFO.name}'s portfolio site.
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-medium">{currentTime}</p>
          <p className="text-sm text-muted-foreground">{date}</p>
        </div>
      </div>
      
      <div className="mt-4 border-t border-gray-700/30 pt-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <LinuxLogo size={30} color="currentColor" className="opacity-80" />
          </div>
          <div className="flex-1 flex items-start justify-between">
            <div className="quote-container">
              <p className="text-sm italic text-muted-foreground">"{quote.text}"</p>
              <p className="text-xs mt-1 text-right">— {quote.author}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-6 w-6 p-0 rounded-full bg-white/5 hover:bg-white/10 dark:bg-dark/30 dark:hover:bg-dark/50 ml-2 flex-shrink-0"
              onClick={() => setQuote(getRandomQuote())}
              title="Get new quote"
            >
              <RefreshCcw className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeMessage;