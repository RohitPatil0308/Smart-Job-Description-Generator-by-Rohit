import React, { useState, useCallback, useEffect } from 'react';
import { generateJobDescriptionStream } from './services/geminiService';
import Input from './components/Input';
import Textarea from './components/Textarea';
import Button from './components/Button';
import Loader from './components/Loader';
import DescriptionCard from './components/DescriptionCard';
import ThemeToggle from './components/ThemeToggle';

// Helper function to determine the initial theme, prioritizing user's choice in localStorage,
// then system preference, and defaulting to 'light'.
const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') {
    return 'light'; // Default for server-side rendering
  }
  const storedTheme = window.localStorage.getItem('theme');
  if (storedTheme === 'dark' || storedTheme === 'light') {
    return storedTheme;
  }
  const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return userPrefersDark ? 'dark' : 'light';
};


const App: React.FC = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [theme, setTheme] = useState(getInitialTheme);

  // Effect to apply the 'dark' class to the <html> element. This makes the theme switch work.
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      // Whenever the theme is dark, add the 'dark' class to the <html> element.
      root.classList.add('dark');
    } else {
      // Otherwise, remove it.
      root.classList.remove('dark');
    }
  }, [theme]);

  // Effect to listen for OS-level theme changes and update the app theme
  // if the user hasn't made an explicit choice.
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // If the user hasn't set an explicit preference via the toggle, follow the system theme.
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !skills || !experience) {
      setError('Please fill out all fields.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setDescription('');

    try {
      const stream = generateJobDescriptionStream(jobTitle, skills, experience);
      for await (const chunk of stream) {
        setDescription((prev) => prev + chunk);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [jobTitle, skills, experience]);

  const canSubmit = !isLoading && !!jobTitle && !!skills && !!experience;
  
  // Toggles the theme between 'light' and 'dark' and saves the choice to localStorage.
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8 relative">
          <div className="absolute top-0 right-0">
             <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-500 dark:from-indigo-400 dark:to-purple-500">
            Smart Job Description Generator
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">by Rohit</p>
        </header>

        <main className="bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Job Title"
              id="jobTitle"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Senior Frontend Engineer"
              required
              disabled={isLoading}
            />
            <Textarea
              label="Key Skills & Technologies"
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g., React, TypeScript, Next.js, Tailwind CSS"
              required
              disabled={isLoading}
            />
            <Input
              label="Experience Level"
              id="experience"
              type="text"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="e.g., 5+ years of professional experience"
              required
              disabled={isLoading}
            />
            <Button type="submit" disabled={!canSubmit}>
              {isLoading ? 'Generating...' : '✨ Generate Description'}
            </Button>
          </form>
        </main>
        
        <div className="mt-8">
            {isLoading && <Loader />}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/50 dark:border-red-700 dark:text-red-300 px-4 py-3 rounded-md text-center" role="alert">
                    <strong className="font-bold">Oops! </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            {description && <DescriptionCard description={description} />}
        </div>
      </div>
    </div>
  );
};

export default App;