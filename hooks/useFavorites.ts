import { addFavorite, fetchFavorites, removeFavorite } from '@/app/api/DoxFavoritesApi';
import { useCallback, useState } from 'react';

export function useFavorites() {
  const [favIds, setFavIds] = useState<Set<string>>(new Set());

  const toggleFavorite = useCallback(
    async (film) => {
      const idStr = film.id.toString();
      const next = new Set(favIds);
      if (next.has(idStr)) {
        await removeFavorite(film.id);
        next.delete(idStr);
      } else {
        await addFavorite(film);
        next.add(idStr);
      }
      setFavIds(next);
    },
    [favIds]
  );

  const loadFavorites = useCallback(async () => {
    const favArray = await fetchFavorites();
    setFavIds(new Set(favArray.map(f => f.id.toString())));
  }, []);

  return { favIds, toggleFavorite, loadFavorites };
}

