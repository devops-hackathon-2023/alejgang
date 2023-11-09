import { ApiError, CancelablePromise, DeploymentResponse, type PageResponseDeploymentResponse } from '$lib/client';
import { roundTo3Digits } from '$lib/math';

import { estimate } from '$lib/pipeline';
import { either, option } from 'fp-ts';
import type { Either } from 'fp-ts/lib/Either';
import { assert, describe, it } from 'vitest';

describe('estimate', () => {
  const sharedData = {
    deploymentUnitId: 'id',
    appModuleId: '',
    changeTicketId: '',
    deployer: '',
    id: '',
    environment: DeploymentResponse.environment.DEV,
    finishedAt: option.none,
    platform: DeploymentResponse.platform.AZURE,
    sasId: '',
    status: DeploymentResponse.status.STARTED,
    versionId: '',
  } as const;
  it('for constant graph', async () => {
    const estimatedTime = estimate({
      ...sharedData,
      deploymentUnitId: 'id',
      duration: option.some(10),
      startedAt: '2023-02-01T00:00:00.000Z',
    })(
      () => () =>
        new CancelablePromise<Either<ApiError, PageResponseDeploymentResponse>>((resolve) =>
          resolve(
            either.right({
              itemsTotalCount: 20,
              nextPage: option.none,
              pageCount: 1,
              pageNumber: 1,
              pageSize: 20,
              page: [
                {
                  ...sharedData,
                  duration: option.some(100),
                  startedAt: '2023-01-01T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(100),
                  startedAt: '2023-01-02T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(100),
                  startedAt: '2023-01-03T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(100),
                  startedAt: '2023-01-04T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(100),
                  startedAt: '2023-01-05T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(100),
                  startedAt: '2023-01-06T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(100),
                  startedAt: '2023-01-07T00:00:00.000Z',
                },
              ],
            }),
          ),
        ),
    );
    const response = await estimatedTime();
    assert(either.isRight(response));
    assert(response.right === 100);
  });
  it('for constant graph wiggles around a number', async () => {
    const estimatedTime = estimate({
      ...sharedData,
      deploymentUnitId: 'id',
      duration: option.some(10),
      startedAt: '2023-01-01T00:00:00.000Z',
    })(
      () => () =>
        new CancelablePromise<Either<ApiError, PageResponseDeploymentResponse>>((resolve) =>
          resolve(
            either.right({
              itemsTotalCount: 20,
              nextPage: option.none,
              pageCount: 1,
              pageNumber: 1,
              pageSize: 20,
              page: [
                {
                  ...sharedData,
                  duration: option.some(101),
                  startedAt: '2023-01-01T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(99),
                  startedAt: '2023-01-02T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(98),
                  startedAt: '2023-01-03T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(102),
                  startedAt: '2023-01-04T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(101),
                  startedAt: '2023-01-05T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(100),
                  startedAt: '2023-01-06T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(100),
                  startedAt: '2023-01-07T00:00:00.000Z',
                },
              ],
            }),
          ),
        ),
    );
    const response = await estimatedTime();
    assert(either.isRight(response));
    assert(roundTo3Digits(response.right) === 100);
  });
  it('for constant graph wiggles around a number', async () => {
    const estimatedTime = estimate({
      ...sharedData,
      deploymentUnitId: 'id',
      duration: option.some(10),
      startedAt: '2023-02-01T00:00:00.000Z',
    })(
      () => () =>
        new CancelablePromise<Either<ApiError, PageResponseDeploymentResponse>>((resolve) =>
          resolve(
            either.right({
              itemsTotalCount: 20,
              nextPage: option.none,
              pageCount: 1,
              pageNumber: 1,
              pageSize: 20,
              page: [
                {
                  ...sharedData,
                  duration: option.some(101),
                  startedAt: '2023-01-01T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(99),
                  startedAt: '2023-01-02T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(98),
                  startedAt: '2023-01-03T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(102),
                  startedAt: '2023-01-04T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(101),
                  startedAt: '2023-01-05T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(100),
                  startedAt: '2023-01-06T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(100),
                  startedAt: '2023-01-07T00:00:00.000Z',
                },
              ],
            }),
          ),
        ),
    );
    const response = await estimatedTime();
    assert(either.isRight(response));
    assert(response.right === 100);
  });
  it('for that grew in the past but now got stable', async () => {
    const estimatedTime = estimate({
      ...sharedData,
      deploymentUnitId: 'id',
      duration: option.some(10),
      startedAt: '2023-02-01T00:00:00.000Z',
    })(
      () => () =>
        new CancelablePromise<Either<ApiError, PageResponseDeploymentResponse>>((resolve) =>
          resolve(
            either.right({
              itemsTotalCount: 20,
              nextPage: option.none,
              pageCount: 1,
              pageNumber: 1,
              pageSize: 20,
              page: [
                {
                  ...sharedData,
                  duration: option.some(60),
                  startedAt: '2022-01-01T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(65),
                  startedAt: '2022-01-02T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(70),
                  startedAt: '2022-01-03T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(80),
                  startedAt: '2022-01-04T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(90),
                  startedAt: '2022-01-05T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(101),
                  startedAt: '2023-01-01T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(99),
                  startedAt: '2023-01-02T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(98),
                  startedAt: '2023-01-03T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(102),
                  startedAt: '2023-01-04T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(101),
                  startedAt: '2023-01-05T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(100),
                  startedAt: '2023-01-06T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(100),
                  startedAt: '2023-01-07T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(102),
                  startedAt: '2023-01-08T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(101),
                  startedAt: '2023-01-09T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(100),
                  startedAt: '2023-01-10T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(100),
                  startedAt: '2023-01-11T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(100),
                  startedAt: '2023-01-12T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(102),
                  startedAt: '2023-01-13T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(101),
                  startedAt: '2023-01-14T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(100),
                  startedAt: '2023-01-15T00:00:00.000Z',
                },
                {
                  ...sharedData,
                  duration: option.some(100),
                  startedAt: '2023-01-16T00:00:00.000Z',
                },
              ],
            }),
          ),
        ),
    );
    const response = await estimatedTime();
    assert(either.isRight(response));
    assert(response.right === 100);
  });
});
