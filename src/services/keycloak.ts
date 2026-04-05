import Keycloak from "keycloak-js";

interface ParsedToken extends Record<string, any> {
  sub?: string;
  email?: string;
  name?: string;
  preferred_username?: string;
  realm_access?: { roles?: string[] };
  resource_access?: Record<string, { roles?: string[] }>;
}

const keycloak: any = new (Keycloak as any)({
  url: process.env.VUE_APP_KEYCLOAK_URL || "",
  realm: process.env.VUE_APP_KEYCLOAK_REALM || "",
  clientId: process.env.VUE_APP_KEYCLOAK_CLIENT_ID || "iom-itb-admin",
});

let initialized = false;
let initPromise: Promise<boolean> | null = null;

const OIDC_CALLBACK_KEYS = new Set([
  "state",
  "session_state",
  "iss",
  "code",
  "error",
  "error_description",
]);

function cleanupOidcCallbackUrl(): void {
  const url = new URL(window.location.href);
  let changed = false;

  const searchParams = new URLSearchParams(url.search);
  for (const key of OIDC_CALLBACK_KEYS) {
    if (searchParams.has(key)) {
      searchParams.delete(key);
      changed = true;
    }
  }
  url.search = searchParams.toString() ? `?${searchParams.toString()}` : "";

  if (url.hash) {
    const hashValue = url.hash.startsWith("#") ? url.hash.slice(1) : url.hash;
    const hashParams = new URLSearchParams(hashValue);
    let hashChanged = false;

    for (const key of OIDC_CALLBACK_KEYS) {
      if (hashParams.has(key)) {
        hashParams.delete(key);
        hashChanged = true;
      }
    }

    if (hashChanged) {
      const nextHash = hashParams.toString();
      url.hash = nextHash ? `#${nextHash}` : "";
      changed = true;
    }
  }

  if (changed) {
    window.history.replaceState({}, document.title, `${url.pathname}${url.search}${url.hash}`);
  }
}

async function init(): Promise<boolean> {
  if (initialized) {
    return !!keycloak.authenticated;
  }

  if (initPromise) {
    return initPromise;
  }

  const options: Record<string, any> = {
    onLoad: "check-sso",
    pkceMethod: "S256",
    checkLoginIframe: false,
    responseMode: "query",
    silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
    silentCheckSsoFallback: true,
  };

  initPromise = keycloak.init(options)
    .then((authenticated: boolean) => {
      initialized = true;
      cleanupOidcCallbackUrl();
      return authenticated;
    })
    .catch((error: unknown) => {
      initialized = false;
      initPromise = null;
      throw error;
    });

  return initPromise!;
}

function isAuthenticated(): boolean {
  return !!keycloak.authenticated;
}

async function getValidToken(minValidity = 30): Promise<string | null> {
  if (!keycloak.authenticated) return null;

  try {
    await keycloak.updateToken(minValidity);
    return keycloak.token || null;
  } catch {
    return null;
  }
}

function getToken(): string | null {
  return keycloak.token || null;
}

function getParsedToken(): ParsedToken | null {
  return (keycloak.tokenParsed as ParsedToken) || null;
}

async function login(): Promise<void> {
  if (!initialized) {
    await init();
  }

  const loginUrl = await keycloak.createLoginUrl({
    redirectUri: `${window.location.origin}/select`,
    responseMode: "query",
  });
  window.location.assign(loginUrl);
}

async function logout(): Promise<void> {
  if (!initialized) {
    await init();
  }

  const logoutUrl = await keycloak.createLogoutUrl({
    redirectUri: `${window.location.origin}/`,
  });
  window.location.assign(logoutUrl);
}

export default {
  init,
  isAuthenticated,
  getValidToken,
  getToken,
  getParsedToken,
  login,
  logout,
};
