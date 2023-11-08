import type { AppModuleResponse, SasResponse } from '$lib/client';

import { writable } from 'svelte/store';

export const favorites = writable<[SasResponse, AppModuleResponse][]>([]);
