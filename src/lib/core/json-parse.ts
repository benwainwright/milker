export const jsonParse = <T = never>(text: string): T => {
  return JSON.parse(text) as T;
};
