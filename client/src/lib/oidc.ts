import { WebStorageStateStore, type UserManagerSettings } from "oidc-client-ts";

declare global {
  interface Window {
    __RUNTIME_CONFIG__?: Record<string, string | undefined>;
  }
}

const runtimeConfig = window.__RUNTIME_CONFIG__ ?? {};

const viteEnv = import.meta.env as Record<string, string | undefined>;

function read(key: string, envKey: string, fallback = ""): string {
  return runtimeConfig[key] || viteEnv[envKey] || fallback;
}

export const oidcConfig: UserManagerSettings = {
  authority: read("PUBLIC_OIDC_ISSUER", "VITE_OIDC_ISSUER"),
  client_id: read("PUBLIC_OIDC_CLIENT_ID", "VITE_OIDC_CLIENT_ID"),
  redirect_uri: read(
    "PUBLIC_OIDC_REDIRECT_URI",
    "VITE_OIDC_REDIRECT_URI",
    window.location.origin,
  ),
  scope: "openid profile email offline_access",
  // Keep tokens persistent across reloads (matches the previous
  // Auth0 `cacheLocation: "localstorage"` behavior).
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  // Renew the access token in the background before it expires, using the
  // refresh token (issued via the `offline_access` scope) when available.
  automaticSilentRenew: true,
  // Request an access token for the API audience the backend validates.
  extraQueryParams: {
    audience: read("PUBLIC_OIDC_AUDIENCE", "VITE_OIDC_AUDIENCE"),
  },
  revokeTokensOnSignout: true,
  revokeTokenTypes: ["refresh_token"],
};

if (!oidcConfig.authority || !oidcConfig.client_id) {
  throw new Error(
    "Missing required environment variables: PUBLIC_OIDC_ISSUER and PUBLIC_OIDC_CLIENT_ID",
  );
}