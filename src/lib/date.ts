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
