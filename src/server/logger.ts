import { env } from '@/lib/config/env/server';
import { createMiddleware } from 'hono/factory';
import pino from 'pino';
import { v4 as uuidv4 } from 'uuid';

export const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z',
          },
        }
      : undefined,
});

const colors = {
  method: (str: string) => `\x1b[36m${str}\x1b[0m`, // cyan
  path: (str: string) => `\x1b[33m${str}\x1b[0m`, // yellow
  status: (str: string) =>
    str.startsWith('2')
      ? `\x1b[32m${str}\x1b[0m` // green
      : str.startsWith('4')
        ? `\x1b[33m${str}\x1b[0m` // yellow
        : `\x1b[31m${str}\x1b[0m`, // red
  duration: (str: string) => `\x1b[35m${str}\x1b[0m`, // magenta
  id: (str: string) => `\x1b[90m${str}\x1b[0m`, // gray
};

export const httpLogger = () =>
  createMiddleware(async (c, next) => {
    const start = Date.now();
    const requestId = c.get('requestId') || uuidv4();

    const method = colors.method(c.req.method);
    const path = colors.path(c.req.path);
    const id = colors.id(`[${requestId}]`);

    await next();

    const duration = Date.now() - start;
    const status = colors.status(c.res.status.toString());
    const time = colors.duration(`${duration}ms`);

    logger.info(`${id} ${method} ${path} ${status} - ${time}`);
  });
