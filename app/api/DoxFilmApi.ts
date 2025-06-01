import type { Film } from "@/types/filmTypes";
import type { ScheduleBlock } from '@/types/scheduleTypes';

import { Platform } from 'react-native';

/**
 * Returnerer den korrekte host afhængig af om vi kører i web eller native.
 */
function getHost() {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    console.log('[DEBUG] Platform.OS is web');
    console.log('[DEBUG] window.location.host:', window.location.hostname);
    return window.location.hostname;
  }
  // I emulator/device peger vi mod din maskines LAN-IP eller localhost
  return '10.10.111.53'; 
}

const API_URL = `http://${getHost()}:8080/api/films`;

/**
 * Fetch all films from the DOX API
 */
export async function fetchDoxFilms(): Promise<Film[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Error fetching films: ${response.status}`);
  }
  return response.json();
}

export async function fetchSchedule(date?: string): Promise<ScheduleBlock[]> {
  const query = date ? `?date=${encodeURIComponent(date)}` : "";
  const res = await fetch(`${API_URL}/schedule${query}`);
  if (!res.ok) {
    throw new Error(`Fejl ved hentning af schedule: ${res.status}`);
  }
  return res.json();
}