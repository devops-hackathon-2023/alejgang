import { writable } from 'svelte/store';

export const selectedAppModule = writable<string | null>(null);
