import { getUnitById } from '$lib';
import { error } from '@sveltejs/kit';
import { either } from 'fp-ts';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  const deployment = await getUnitById(params.deploymentUnitId)();
  if (either.isLeft(deployment)) {
    throw error(404, 'Not found');
  }
  return {
    deployment,
  };
};
