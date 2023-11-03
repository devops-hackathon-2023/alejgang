export const selectOptions = <T extends { id: string; name: string }>(data: T[]): [string, string][] => {
  return data.map(($) => [$.id, $.name]);
};
