import { io, option, string } from 'fp-ts';
import type { IO } from 'fp-ts/lib/IO';
import type { Option } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';

export const dateToStr = (date: Date) => pipe(date, (date) => date.toISOString(), string.slice(0, -5));

export const dateToUnix = (date: Date) => pipe(date, (date) => date.getTime());

export const strToDate = (date: string): IO<Option<Date>> =>
  pipe(
    () => new Date(date),
    io.map((date) => (Number.isNaN(date.getTime()) ? option.none : option.some(date))),
  );

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
