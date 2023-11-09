import { QualityGateResponse, QualityGatesService } from '$lib/client';
import { option, taskEither } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

const bind =
  <N extends string, A, B>(name: Exclude<N, keyof A>, f: (a: A) => B) =>
  (obj: A): { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B } =>
    ({
      ...obj,
      [name as N]: f(obj),
    }) as { readonly [key in N | keyof A]: key extends keyof A ? A[key] : B };

/**
 * Get the letter corresponding to the rating
 * A = 1
 * A- = (1, 1/3>
 * A/B = (1/3, 2/3>
 * B = (2/3, 2>
 * B- = (2, 2 1/3>
 * B/C = (2 1/3, 2 2/3>
 * C = (2 2/3, 3>
 * C- = (3, 3 1/3>
 * C/D = (3 1/3, 3 2/3>
 * D = (3 2/3, 4>
 * D- = (4, 4 1/3>
 * D/E = (4 1/3, 4 2/3>
 * E = (4 2/3, 5>
 * E- = (5, 5 1/3>
 * E/F = (5 1/3, 5 2/3>
 * F = (5 2/3, 6>
 */
const getRatingLetter = (rating: number) =>
  pipe(
    { rating },
    bind('aCode', () => QualityGateResponse.rating.A.charCodeAt(0)),
    bind('majorCode', ({ rating, aCode }) => Math.floor(rating + 1 / 3) + aCode),
    bind('minorCmp', ({ rating }) => rating - Math.floor(rating) + 1 / 3),
    bind('minor', ({ minorCmp }) => minorCmp - Math.floor(minorCmp)),
    bind('ratingCase', ({ minor }) => (minor <= 1 / 3 ? 0 : minor <= 2 / 3 ? 1 : 2)),
    bind('suffixes', ({ majorCode }) => ['', '-', `/${String.fromCharCode(majorCode)}`]),
    bind('suffix', ({ ratingCase, suffixes }) => suffixes[ratingCase]),
    ({ majorCode, suffix }) => `${String.fromCharCode(majorCode - 1)}${suffix}`,
  );

export const qualityGateTypes = () => pipe(QualityGateResponse.type, Object.values);

export const getQualityGatesForVersion = (versionId: string) =>
  pipe(
    () => QualityGatesService.list2({ versionId: option.some(versionId) }),
    taskEither.map(($) => $.page),
  );

export const getQualityGatesWithStatistics = (versionId: string) =>
  pipe(
    taskEither.Do,
    taskEither.bind('qualityGates', () => getQualityGatesForVersion(versionId)),
    taskEither.map(($) => ({
      qualityGates: $.qualityGates,
      statistics: {
        passed: $.qualityGates.filter((qualityGate) => qualityGate.result === QualityGateResponse.result.PASSED).length,
        total: $.qualityGates.length,
        averageRating: getRatingLetter(
          $.qualityGates
            .map(({ rating }) => rating)
            .filter(option.isSome)
            .reduce(
              (acc, rating, _, array) =>
                acc + (rating.value.charCodeAt(0) - QualityGateResponse.rating.A.charCodeAt(0) + 1) / array.length,
              0,
            ),
        ),
      },
    })),
  );
