import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import React from 'react';

import { Footer } from '@/components';
import { getAccessToken, getUser, login, logout } from '@/utils/auth';
import defaultSettings from '../config/defaultSettings';

const isDev = process.env.NODE_ENV === 'development';

/**
 * @see https://umijs.org/docs/api/runtime-config#getinitialstate
 */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: { name?: string; avatar?: string; userid?: string };
  loading?: boolean;
}> {
  // Skip auth check on OIDC callback page
  if (history.location.pathname === '/oidc-callback') {
    return { settings: defaultSettings as Partial<LayoutSettings> };
  }

  const user = await getUser();
  if (user && !user.expired) {
    return {
      currentUser: {
        name: user.profile.preferred_username || user.profile.name || user.profile.sub,
        userid: user.profile.sub,
      },
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }

  // Not authenticated, redirect to ABP login
  await login(history.location.pathname + history.location.search);
  return { settings: defaultSettings as Partial<LayoutSettings> };
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    avatarProps: {
      title: initialState?.currentUser?.name || 'User',
      render: (_, dom) => dom,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { pathname } = history.location;
      if (pathname === '/oidc-callback') return;

      if (!initialState?.currentUser) {
        login(pathname);
      }
    },
    menuHeaderRender: undefined,
    actionsRender: () => [
      <a key="logout" onClick={() => logout()} style={{ padding: '0 12px' }}>
        退出登录
      </a>,
    ],
    ...initialState?.settings,
  };
};

/**
 * @name request 配置
 * Attach OIDC access token to every API request.
 */
export const request: RequestConfig = {
  baseURL: isDev ? '' : '',
  requestInterceptors: [
    async (config: any) => {
      const token = await getAccessToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: ['Bearer', token].join(' '),
        };
      }
      return config;
    },
  ],
};
