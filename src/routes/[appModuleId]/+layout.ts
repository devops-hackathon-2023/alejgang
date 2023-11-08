import { getAppModuleById, getSasById, getUnitsByModuleId } from '$lib';
import type { DeploymentUnitResponse } from '$lib/client';
import { error } from '@sveltejs/kit';
import { either, option } from 'fp-ts';
import type { LayoutLoad } from './$types';

export const ssr = false;
export const prerender = false;

export const load: LayoutLoad = async ({ params }) => {
  console.log('pageLoad!');
  const appModuleId = params.appModuleId;

  const appModule = await getAppModuleById(appModuleId)();

  if (either.isLeft(appModule)) {
    throw error(404, 'Not found');
  }

  const sas = await getSasById(appModule.right.sasId)();

  if (either.isLeft(sas)) {
    throw error(404, 'Not found');
  }

  return {
    sas: sas.right,
    appModule: appModule.right,
    units: either.getOrElse(() => [] as DeploymentUnitResponse[])(
      await getUnitsByModuleId(option.some(appModule.right.id))(),
    ),
  };
};
