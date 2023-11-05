import { dateToStr, subYears } from '$lib/date';
import { console, date, either, io, option, taskEither } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import {
  AppModulesService,
  DeploymentUnitsService,
  DeploymentsService,
  OpenAPI,
  SaSesService,
  StartDeploymentRequest,
} from './client';

OpenAPI.USERNAME = 'dopo';
OpenAPI.PASSWORD = 'DevOps2023';

export const example = async () => {
  const deployment = await DeploymentsService.start({
    requestBody: {
      version: '1.0.0',
      changeTicketId: '1234',
      deploymentUnitName: 'dopo-be',
      deployer: 'Test',
      environment: StartDeploymentRequest.environment.DEV,
      platform: StartDeploymentRequest.platform.AZURE,
    },
  });
  if (either.isLeft(deployment)) {
    console.error(deployment.left);
    return;
  }
  console.log(deployment.right.toString());
};

export const getUnits = pipe(
  () =>
    DeploymentUnitsService.list4({
      createdAtGte: pipe(date.create, subYears(1), io.map(dateToStr), (io) => io(), option.some),
      createdAtLte: pipe(date.create, io.map(dateToStr), (io) => io(), option.some),
    }),
  taskEither.map((r) => r.page),
  taskEither.tapIO((data) => console.log(data)),
);

export const getUnitsByModuleId = (appModuleId: string | null) =>
  pipe(
    () =>
      DeploymentUnitsService.list4({
        createdAtGte: pipe(date.create, subYears(1), io.map(dateToStr), (io) => io(), option.some),
        createdAtLte: pipe(date.create, io.map(dateToStr), (io) => io(), option.some),
      }),
    taskEither.map((r) => r.page),
    taskEither.tapIO((data) => console.log(data)),
    taskEither.map(($) => $.filter((unit) => unit.appModuleId === appModuleId)),
  );

export const getSASes = pipe(
  () => SaSesService.list({}),
  taskEither.map(($) => $.page),
  taskEither.tapIO((data) => console.log(data)),
);

export const getAppModulesBySas = (sasId: string) =>
  pipe(
    () => AppModulesService.list1({ sasId }),
    taskEither.map(($) => $.page),
    taskEither.tapIO((data) => console.log(data)),
  );

export const ahfoieahjfeio = pipe(
  () =>
    AppModulesService.list1({
      sasId: 'Dd',
    }),
  taskEither.map(($) => $.page),
  taskEither.tapIO((data) => console.log(data)),
);
