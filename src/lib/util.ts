export const selectOptions = <T extends { id: string; name: string }>(data: T[]): [string, string][] => {
  return data.map(($) => [$.id, $.name]);
};

export const copy = (string: string) => {
  if (!string) return;
  navigator.clipboard.writeText(string);
};
