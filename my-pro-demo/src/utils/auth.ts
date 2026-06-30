import { UserManager, WebStorageStateStore } from 'oidc-client-ts';

const userManager = new UserManager({
  authority: OIDC_AUTHORITY,
  client_id: OIDC_CLIENT_ID,
  redirect_uri: `${window.location.origin}/oidc-callback`,
  post_logout_redirect_uri: window.location.origin,
  response_type: 'code',
  scope: 'openid profile email phone roles MyProject',
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  automaticSilentRenew: true,
});

export function getUserManager(): UserManager {
  return userManager;
}

export async function getUser() {
  return userManager.getUser();
}

export async function getAccessToken(): Promise<string | null> {
  const user = await userManager.getUser();
  return user?.access_token ?? null;
}

export async function login(redirectPath?: string) {
  const state = redirectPath || window.location.pathname + window.location.search;
  await userManager.signinRedirect({ state });
}

export async function handleCallback() {
  return userManager.signinRedirectCallback();
}

export async function logout() {
  await userManager.signoutRedirect();
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await userManager.getUser();
  return !!user && !user.expired;
}
