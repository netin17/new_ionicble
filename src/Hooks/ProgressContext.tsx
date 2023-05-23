import { createContext } from 'react';

interface ProgressContextType {
  progress: string;
  updateProgress: (value: string) => void;
}

export const ProgressContext = createContext<ProgressContextType>({
  progress: '',
  updateProgress: () => {},
});