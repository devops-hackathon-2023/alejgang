import { string } from 'fp-ts';
import { getEq } from 'fp-ts/lib/Option';

export const optionEqString = getEq(string.Eq);
