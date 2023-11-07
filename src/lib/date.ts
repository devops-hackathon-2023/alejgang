import { io, string } from 'fp-ts';
import type { IO } from 'fp-ts/lib/IO';
import { pipe } from 'fp-ts/lib/function';

export const dateToStr = (date: Date) => pipe(date, (date) => date.toISOString(), string.slice(0, -5));

export const addYears = (n: number) => (date: IO<Date>) =>
  pipe(
    date,
    io.tap((date) => () => date.setFullYear(date.getFullYear() + n)),
  );

export const subYears = (n: number) => (date: IO<Date>) =>
  pipe(
    date,
    io.tap((date) => () => date.setFullYear(date.getFullYear() - n)),
  );

export const secondsToHMS = (seconds: number, hideIfZero = false) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours}:${minutes.toLocaleString(undefined, { minimumIntegerDigits: 2 })}:${remainingSeconds.toLocaleString(
    undefined,
    { minimumIntegerDigits: 2 },
  )}`;
};
