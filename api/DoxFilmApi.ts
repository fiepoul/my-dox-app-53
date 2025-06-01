import films from '@/data/films.json';
import type { Film } from "@/types/filmTypes";
import type { ScheduleBlock } from '@/types/scheduleTypes';

export async function fetchDoxFilms(): Promise<Film[]> {
  return films;
}

/**
 * Henter schedule grupperet i tidsblokke – valgfrit filtreret på dato
 */
export async function fetchSchedule(date?: string): Promise<ScheduleBlock[]> {
  const scheduleMap: Record<string, ScheduleBlock> = {};

  films.forEach((film) => {
    film.schedules.forEach((s) => {
      if (!date || s.date === date) {
        if (!scheduleMap[s.time]) {
          scheduleMap[s.time] = {
            time: s.time,
            events: [],
          };
        }

        scheduleMap[s.time].events.push({
          id: film.id,
          title: film.title,
          cinema: s.cinema,
        });
      }
    });
  });

  return Object.values(scheduleMap).sort((a, b) =>
    a.time.localeCompare(b.time)
  );
}