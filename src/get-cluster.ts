import { IncomingMessage } from 'http';
import { nodeFetch } from './node-fetch';
import { NodeFetchOptions } from './';

const CLUSTERS_PATH = '';

let storedCluster: string;

const extractClusterFromResponse = (
  response: [IncomingMessage, string],
): string => {
  storedCluster = (response as unknown) as string;
  return storedCluster;
};

export const getCluster = async ({
  refreshCluster = false,
  ...nodeFetchOptions
}: GetClustersOptions = {}): Promise<string> => {
  if (!refreshCluster && storedCluster) {
    return Promise.resolve(storedCluster);
  }

  try {
    const {
      path: clustersPath = CLUSTERS_PATH,
      ...otherNodeFetchOptions
    } = Object(nodeFetchOptions);

    const response = await nodeFetch({
      method: 'GET',
      path: clustersPath,
      ...otherNodeFetchOptions,
    });

    return extractClusterFromResponse(response);
  } catch (err) {
    throw err;
  }
};

interface GetClustersOptions extends NodeFetchOptions {
  refreshCluster?: boolean;
}
