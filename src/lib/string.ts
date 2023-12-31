export const humanize = (phrase: string): string => {
  return phrase.split('-').join(' ');
};

export const capitalize = (word: string): string => {
  return word[0].toUpperCase() + word.slice(1);
};

export const classNames = (...classes: string[]): string => {
  return classes.filter(Boolean).join(' ');
};
