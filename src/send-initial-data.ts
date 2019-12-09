import { IncomingMessage } from 'http';
import { getAuthenticationToken, buildNodeFetchPath } from './';
import { nodeFetch } from './node-fetch';

const TOKEN_HEADER = 'x-auth-token';
const HOSTNAME = 'postman-echo.com'; // TODO
const PATH = 'post';

export const sendInitialData = async ({
  refreshToken = false,
  refreshCluster = false,
  data = 'kasia',
  hostname = HOSTNAME,
  sendDataPath = PATH,
} = {}): Promise<IncomingMessage> => {
  if (data) {
    const authenticationToken = await getAuthenticationToken({ refreshToken });

    try {
      const [response] = await nodeFetch({
        headers: {
          [TOKEN_HEADER]: authenticationToken,
        },
        body: data,
        hostname,
        path: buildNodeFetchPath(sendDataPath, { refreshCluster }),
      });

      return response;
    } catch (err) {
      throw err;
    }
  }
};
