import { console, either, option, taskEither } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { DeploymentUnitsService, DeploymentsService, OpenAPI, StartDeploymentRequest } from './client';

OpenAPI.USERNAME = 'dopo';
OpenAPI.PASSWORD = 'DevOps2023';

export const example = async () => {
  const deployment = await DeploymentsService.start({
    version: '1.0.0',
    changeTicketId: '1234',
    deploymentUnitName: 'dopo-be',
    deployer: 'Test',
    environment: StartDeploymentRequest.environment.DEV,
    platform: StartDeploymentRequest.platform.AZURE,
  });
  if (either.isLeft(deployment)) {
    console.error(deployment.left);
    return;
  }
  console.log(deployment.right.toString());
};

export const getUnits = pipe(
  () =>
    DeploymentUnitsService.list4(
      option.none,
      undefined,
      undefined,
      undefined,
      option.none,
      option.none,
      option.none,
      option.some('2023-09-01T20:52:14'),
      option.some('2023-11-01T20:52:15'),
    ),
  taskEither.map((r) => r.page),
  taskEither.tapIO((data) => console.log(data)),
);
