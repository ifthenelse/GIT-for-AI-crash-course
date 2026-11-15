import { createApp } from './app.ts';
import { createD1Database, type D1Binding } from './database.ts';

export interface WorkerEnvironment {
  DB: D1Binding;
  APP_ORIGIN: string;
  ALLOW_ORIGINS?: string;
  AUTH_SECRET?: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
}
const instances = new WeakMap<D1Binding, ReturnType<typeof createApp>>();
/** Deployment configuration and production provisioning are deliberately separate. */
export default {
  fetch(request: Request, env: WorkerEnvironment) {
    let app = instances.get(env.DB);
    if (!app) {
      app = createApp({
      db: createD1Database(env.DB),
      development: false,
      initializeSchema: false,
      appOrigin: env.APP_ORIGIN,
      allowOrigins: env.ALLOW_ORIGINS?.split(',').map(value => value.trim()),
      authSecret: env.AUTH_SECRET,
      githubClientId: env.GITHUB_CLIENT_ID,
      githubClientSecret: env.GITHUB_CLIENT_SECRET,
      });
      instances.set(env.DB, app);
    }
    return app.fetch(request);
  },
};
