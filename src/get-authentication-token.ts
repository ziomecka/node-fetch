import { IncomingMessage } from 'http';
import { nodeFetch } from './node-fetch';
import { authenticationData, hostname } from './consts';
import { buildNodeFetchPath, NodeFetchOptions } from './';

const TOKEN_HEADER = 'x-subject-token';
const AUTHENTICATION_PATH = '';

let storedAuthenticationToken: string;

const extractTokenFromResponse = (
  response: IncomingMessage,
  tokenHeader = TOKEN_HEADER,
): string => {
  storedAuthenticationToken = (response.headers[
    tokenHeader
  ] as unknown) as string;

  return storedAuthenticationToken;
};

export const getAuthenticationToken = async ({
  refreshToken = false,
  refreshCluster = false,
  ...nodeFetchOptions
}: GetAuthenticationTokenOptions = {}): Promise<string> => {
  if (!refreshToken && storedAuthenticationToken) {
    return Promise.resolve(storedAuthenticationToken);
  }

  try {
    const {
      path: authenticationPath = AUTHENTICATION_PATH,
      ...otherNodeFetchOptions
    } = Object(nodeFetchOptions);

    const [response] = await nodeFetch({
      hostname,
      path: buildNodeFetchPath(authenticationPath, { refreshCluster }),
      body: JSON.stringify(authenticationData),
      ...otherNodeFetchOptions,
    });

    return extractTokenFromResponse(response);
  } catch (err) {
    throw err;
  }
};

interface GetAuthenticationTokenOptions extends NodeFetchOptions {
  refreshToken?: boolean;
  refreshCluster?: boolean;
}
