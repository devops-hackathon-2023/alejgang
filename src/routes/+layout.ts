import { getSASes } from '$lib';
import { error } from '@sveltejs/kit';
import { either } from 'fp-ts';
import type { LayoutLoad } from './$types';

export const ssr = false;
export const prerender = false;

export const load: LayoutLoad = async () => {
  const sases = await getSASes();

  if (either.isLeft(sases)) {
    throw error(404, 'Not found');
  }

  return {
    sases: sases.right,
  };
};
