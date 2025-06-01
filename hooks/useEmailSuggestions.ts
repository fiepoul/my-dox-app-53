import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export const useEmailSuggestions = () => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('previousEmails').then(stored => {
      if (stored) {
        try {
          setSuggestions(JSON.parse(stored));
        } catch (err) {
          console.error('Could not parse stored emails:', err);
        }
      }
    });
  }, []);

  const updateSuggestions = async (email: string) => {
    try {
      const stored = await AsyncStorage.getItem('previousEmails');
      const list = stored ? JSON.parse(stored) : [];

      if (!list.includes(email)) {
        const updated = [email, ...list].slice(0, 5);
        setSuggestions(updated);
        await AsyncStorage.setItem('previousEmails', JSON.stringify(updated));
      }
    } catch (err) {
      console.error('Failed to update suggestions:', err);
    }
  };

  const getFiltered = (input: string) => {
    return suggestions.filter(e =>
      e.toLowerCase().startsWith(input.toLowerCase()) && input.length > 0
    );
  };

  return {
    suggestions,
    updateSuggestions,
    showSuggestions,
    setShowSuggestions,
    getFiltered,
  };
};