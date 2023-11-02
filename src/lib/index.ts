import { either } from 'fp-ts';
import { DeploymentsService, OpenAPI, StartDeploymentRequest } from './client';

OpenAPI.USERNAME = 'dopo';
OpenAPI.PASSWORD = 'DevOps2023';

export const example = async () => {
  const deployment = await DeploymentsService.start({
    version: '1.0.0',
    changeTicketId: '1234',
    deploymentUnitName: 'Moje unitka',
    deployer: 'Test',
    environment: StartDeploymentRequest.environment.DEV,
    platform: StartDeploymentRequest.platform.AZURE,
  });
  if (either.isLeft(deployment)) {
    console.error(deployment.left);
    return;
  }
  console.log(deployment.right.id);
};
