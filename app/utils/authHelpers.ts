import { getAuth } from 'firebase/auth';

/**
 * Henter UID for den aktuelt loggede ind bruger.
 * Kaster fejl hvis brugeren ikke er logget ind.
 */
export function getCurrentUid(): string {
  const user = getAuth().currentUser;
  if (!user) {
    throw new Error('Not authenticated');
  }
  return user.uid;
}

/**
 * Returnerer hele brugerobjektet fra Firebase Auth.
 * Kaster fejl hvis brugeren ikke er logget ind.
 */
export function getCurrentUser() {
  const user = getAuth().currentUser;
  if (!user) {
    throw new Error('Not authenticated');
  }
  return user;
}

