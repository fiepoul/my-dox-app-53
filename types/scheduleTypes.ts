// Gruppe af events (med film‐id) til én timeblok
export type ScheduleBlock = {
  time: string;
  events: {
    /** bruges til at navigere til /movie/{id} */
    id:     number;
    title:  string;
    cinema: string;
  }[];
};