import { env } from '@/lib/config/env/client';
import { AppType } from '@/server';
import { hc } from 'hono/client';

const client = hc<AppType>(env.NEXT_PUBLIC_APP_URL);
export const api = client.api;
