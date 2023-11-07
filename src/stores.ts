import type { AppModuleResponse, SasResponse } from '$lib/client';
import { option } from 'fp-ts';
import { writable } from 'svelte/store';

export const selectedAppModule = writable<option.Option<AppModuleResponse>>(option.none);
export const selectedSas = writable<option.Option<SasResponse>>(option.none);

export const favorites = writable<[SasResponse, AppModuleResponse][]>([]);
