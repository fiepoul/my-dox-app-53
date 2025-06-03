import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

export function useMovieNavigation() {
  const router = useRouter();

  const goToMovieDetails = (filmId: number) => {
    router.push(`/movie/${filmId}`);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return { goToMovieDetails };
}