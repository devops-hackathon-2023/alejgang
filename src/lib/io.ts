import type { IO } from 'fp-ts/lib/IO';

export const exec = <T>(io: IO<T>) => io();
