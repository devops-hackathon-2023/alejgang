import { type DeploymentResponse, DeploymentsService } from '$lib/client';
import { dateToStr, dateToUnix, strToDate, subYears } from '$lib/date';
import { exec } from '$lib/io';
import { weightedAverage } from '$lib/math';
import { array, date, either, io, number, option, task, taskEither } from 'fp-ts';
import type { Some } from 'fp-ts/lib/Option';
import { min } from 'fp-ts/lib/Ord';
import { pipe } from 'fp-ts/lib/function';

type HasData = { duration: Some<number>; startedAt: Some<Date> };

export const fetchDeploymentsByUnitId = (deploymentUnitId: string) => () =>
  DeploymentsService.list3({
    deploymentUnitId: option.some(deploymentUnitId),
    size: option.some(100),
    startedAtLte: pipe(date.create, io.map(dateToStr), io.map(option.some), exec),
    startedAtGte: pipe(date.create, subYears(1), io.map(dateToStr), io.map(option.some), exec),
  });

export const estimate = (deployment: DeploymentResponse) =>
  pipe(
    deployment,
    ({ deploymentUnitId }) => deploymentUnitId,
    fetchDeploymentsByUnitId,
    taskEither.map(({ page }) => page),
    taskEither.map(array.map(({ duration, startedAt }) => ({ duration, startedAt: strToDate(startedAt)() }))),
    taskEither.map(array.filter(($): $ is HasData => option.isSome($.startedAt) && option.isSome($.duration))),
    taskEither.map(array.map(({ duration, startedAt }) => ({ value: duration.value, date: startedAt.value }))),
    taskEither.map(weightedAverage),
  );

export const remaining = (deployment: DeploymentResponse) =>
  pipe(
    taskEither.bindTo('deployment')(taskEither.of(deployment)),
    taskEither.bind('estimate', ({ deployment }) => estimate(deployment)),
    taskEither.bindW('now', () => pipe(date.create, taskEither.fromIO)),
    taskEither.bind('started', ({ deployment }) =>
      pipe(
        deployment.startedAt,
        strToDate,
        io.map(option.map(dateToUnix)),
        task.fromIO,
        task.map(either.fromOption(() => new Error('Invalid started at date!'))),
      ),
    ),
    taskEither.map(({ estimate, started }) => estimate - started),
    taskEither.map((remaining) => min(number.Ord)(remaining, 0)),
  );
