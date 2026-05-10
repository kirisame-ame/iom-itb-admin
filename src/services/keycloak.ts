import Keycloak from "keycloak-js";

interface ParsedToken extends Record<string, any> {
  sub?: string;
  email?: string;
  name?: string;
  preferred_username?: string;
  realm_access?: { roles?: string[] };
  resource_access?: Record<string, { roles?: string[] }>;
}

declare global {
  interface Window {
    __IOM_KEYCLOAK__?: any;
    __IOM_KEYCLOAK_INIT_PROMISE__?: Promise<boolean> | null;
    __IOM_KEYCLOAK_INITIALIZED__?: boolean;
  }
}

const keycloak =
  window.__IOM_KEYCLOAK__ ||
  new (Keycloak as any)({
    url: process.env.VUE_APP_KEYCLOAK_URL || "",
    realm: process.env.VUE_APP_KEYCLOAK_REALM || "",
    clientId: process.env.VUE_APP_KEYCLOAK_CLIENT_ID || "iom-itb-admin",
  });

window.__IOM_KEYCLOAK__ = keycloak;

const cleanupOidcCallbackUrl = () => {
  const url = new URL(window.location.href);

  const oidcParams = [
    "state",
    "session_state",
    "code",
    "iss",
    "error",
    "error_description",
  ];

  let hasOidcParams = false;

  oidcParams.forEach((param) => {
    if (url.searchParams.has(param)) {
      url.searchParams.delete(param);
      hasOidcParams = true;
    }
  });

  if (hasOidcParams) {
    const cleanUrl =
      url.pathname + url.search + url.hash;

    window.history.replaceState({}, document.title, cleanUrl);
  }
};

async function init(): Promise<boolean> {
  if (window.__IOM_KEYCLOAK_INITIALIZED__) {
    return !!keycloak.authenticated;
  }

  if (window.__IOM_KEYCLOAK_INIT_PROMISE__) {
    return window.__IOM_KEYCLOAK_INIT_PROMISE__;
  }

  const options: Record<string, any> = {
    onLoad: "check-sso",
    pkceMethod: "S256",
    checkLoginIframe: false,
    responseMode: "query",
    silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
    silentCheckSsoFallback: true,
  };

  window.__IOM_KEYCLOAK_INIT_PROMISE__ = keycloak
    .init(options)
    .then((authenticated: boolean) => {
      window.__IOM_KEYCLOAK_INITIALIZED__ = true;
      cleanupOidcCallbackUrl();
      return authenticated;
    })
    .catch((error: unknown) => {
      window.__IOM_KEYCLOAK_INIT_PROMISE__ = null;
      window.__IOM_KEYCLOAK_INITIALIZED__ = false;
      throw error;
    });

  return window.__IOM_KEYCLOAK_INIT_PROMISE__!;
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
  await init();

  const loginUrl = await keycloak.createLoginUrl({
    redirectUri: `${window.location.origin}/select`,
    responseMode: "query",
  });

  window.location.assign(loginUrl);
}

async function logout(): Promise<void> {
  await init();

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
