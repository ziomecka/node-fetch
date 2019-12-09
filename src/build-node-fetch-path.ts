import { getCluster } from './';

export const buildNodeFetchPath = (nodeFetchPath, { refreshCluster }): string =>
  `/proxy/${getCluster({ refreshCluster })}/${nodeFetchPath}`;
