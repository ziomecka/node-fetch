import { RequestOptions, IncomingMessage } from 'http';
import * as https from 'https';

import { hostname as DEFAULT_HOSTNAME } from './consts';

const DEFAULT_METHOD = 'POST';

export const nodeFetch = async ({
  body,
  method = DEFAULT_METHOD,
  headers,
  hostname = DEFAULT_HOSTNAME,
  ...otherOptions
}: NodeFetchOptions = {}): Promise<[IncomingMessage, string]> => {
  return new Promise((resolve, reject) => {
    const isPost = method === 'POST';
    const request = https.request(
      {
        method,
        hostname,
        headers: isPost
          ? {
              'content-length': body.length,
              'content-type': 'application/json',
              ...headers,
            }
          : headers,
        ...otherOptions,
      },
      response => {
        let data = '';
        response.on('data', chunk => {
          data = `${data}${chunk.toString()}`;
        });
        response.on('end', () => resolve([response, data]));
      },
    );

    request.on('error', reject);

    if (isPost) {
      request.write(body);
    }

    request.end();
  });
};

export type NodeFetchOptions = RequestOptions & { body?: string };
