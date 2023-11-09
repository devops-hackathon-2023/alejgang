import { dateToStr, subYears } from '$lib/date';
import { optionEqString } from '$lib/eq';
import { console, date, either, io, option, taskEither } from 'fp-ts';
import { groupBy } from 'fp-ts/lib/NonEmptyArray';

import type { Option } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';
import {
  AppModulesService,
  DeploymentResponse,
  DeploymentUnitVersionsService,
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
      size: option.some(100),
    }),
  taskEither.map((r) => r.page),
  taskEither.tapIO((data) => console.log(data)),
);

export const getUnitsByModuleId = (appModuleId: option.Option<string>) =>
  pipe(
    () =>
      DeploymentUnitsService.list4({
        createdAtGte: pipe(date.create, subYears(1), io.map(dateToStr), (io) => io(), option.some),
        createdAtLte: pipe(date.create, io.map(dateToStr), (io) => io(), option.some),
        size: option.some(100),
      }),
    taskEither.map((r) => r.page),
    taskEither.tapIO((data) => console.log(data)),
    taskEither.map(($) => $.filter((unit) => optionEqString.equals(option.some(unit.appModuleId), appModuleId))),
  );

export const getSASes = pipe(
  () =>
    SaSesService.list({
      size: option.some(100),
    }),
  taskEither.map(($) => $.page),
  taskEither.tapIO((data) => console.log(data)),
);

export const getAppModulesBySas = (sasId: string) =>
  pipe(
    () => AppModulesService.list1({ sasId, size: option.some(100) }),
    taskEither.map(($) => $.page),
    taskEither.tapIO((data) => console.log(data)),
  );

export const getAppModuleById = (appModuleId: string) => pipe(() => AppModulesService.detail5({ appModuleId }));

export const getSasById = (sasId: string) => pipe(() => SaSesService.detail({ sasId }));

export const getDeployments = (deploymentUnitId: Option<string> = option.none) =>
  pipe(
    () =>
      DeploymentsService.list3({
        startedAtGte: pipe(date.create, subYears(1), io.map(dateToStr), (io) => io(), option.some),
        startedAtLte: pipe(date.create, io.map(dateToStr), (io) => io(), option.some),
        deploymentUnitId,
        size: option.some(100),
      }),
    taskEither.map(($) => $.page),
  );

export const getUnitVersions = (deploymentUnitId: string, page: Option<number> | undefined = undefined) =>
  pipe(
    () =>
      DeploymentUnitVersionsService.list5({
        deploymentUnitId,
        page,
        size: option.some(100),
      }),
    taskEither.map(($) => $.page),
  );

export const getDeploymentsWithVersions = (deploymentUnitId: string) =>
  pipe(
    taskEither.Do,
    taskEither.bind('deployments', () => getDeployments(option.some(deploymentUnitId))),
    taskEither.bind('versions', () =>
      pipe(
        getUnitVersions(deploymentUnitId),
        taskEither.map(($) => $.map(($) => [$.id, $] as const)),
        taskEither.map(($) => new Map($)),
      ),
    ),
    taskEither.map(($) => [
      ...$.deployments.map((i) => ({
        ...i,
        version: $.versions.get(i.versionId),
      })),
    ]),
  );

export const getDeploymentsWithVersionsGroupedByEnv = (deploymentUnitId: string) =>
  pipe(getDeploymentsWithVersions(deploymentUnitId), taskEither.map(groupBy(($) => $.environment)));

export const sortEnvByEnum = (a: string, b: string) =>
  pipe(DeploymentResponse.environment, Object.values, (array: string[]) => array.indexOf(a) - array.indexOf(b));

export const getUnitById = (deploymentUnitId: string) =>
  pipe(() =>
    DeploymentUnitsService.detail3({
      deploymentUnitId,
    }),
  );
