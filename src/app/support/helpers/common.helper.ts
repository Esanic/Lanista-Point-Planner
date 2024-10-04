import { IBuild } from '../interfaces/build';

export const deepCopy = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

export const getBuilds = (): IBuild[] => {
  return JSON.parse(localStorage.getItem('builds')!);
};

export const setBuilds = (builds: IBuild[]): void => {
  localStorage.setItem('builds', JSON.stringify(builds));
};
