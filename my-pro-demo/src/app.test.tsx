import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock all heavy dependencies before importing app
const mockHistory = {
  location: {
    pathname: '/welcome',
    search: '',
    hash: '',
  },
};

const mockGetUser = vi.fn();
const mockLogin = vi.fn();
const mockGetAccessToken = vi.fn();

vi.mock('@umijs/max', () => ({
  history: mockHistory,
  Link: ({ children }: any) => children,
}));

vi.mock('@/utils/auth', () => ({
  getUser: () => mockGetUser(),
  login: (...args: any[]) => mockLogin(...args),
  getAccessToken: () => mockGetAccessToken(),
  logout: vi.fn(),
}));

vi.mock('@/components', () => ({
  AvatarDropdown: () => null,
  DocLink: () => null,
  ErrorBoundary: ({ children }: any) => children,
  Footer: () => null,
  LangDropdown: () => null,
  OfflineBanner: () => null,
  VersionDropdown: () => null,
}));

vi.mock('@ant-design/pro-components', () => ({
  SettingDrawer: () => null,
}));

vi.mock('@ant-design/icons', () => ({
  LinkOutlined: () => null,
}));

vi.mock('../config/defaultSettings', () => ({
  default: { navTheme: 'light' },
}));

describe('app getInitialState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHistory.location = {
      pathname: '/welcome',
      search: '',
      hash: '',
    };
  });

  it('should return currentUser when user is authenticated', async () => {
    const { getInitialState } = await import('./app');
    mockGetUser.mockResolvedValue({
      expired: false,
      profile: {
        preferred_username: 'Test User',
        sub: 'user-123',
      },
    });

    const state = await getInitialState();

    expect(state.currentUser).toEqual({
      name: 'Test User',
      userid: 'user-123',
    });
    expect(state.settings).toEqual({ navTheme: 'light' });
  });

  it('should redirect to login when user is not authenticated', async () => {
    const { getInitialState } = await import('./app');
    mockGetUser.mockResolvedValue(null);

    const state = await getInitialState();

    expect(mockLogin).toHaveBeenCalledWith('/welcome');
    expect(state.currentUser).toBeUndefined();
  });

  it('should redirect to login when user token is expired', async () => {
    const { getInitialState } = await import('./app');
    mockGetUser.mockResolvedValue({ expired: true, profile: {} });

    const state = await getInitialState();

    expect(mockLogin).toHaveBeenCalled();
    expect(state.currentUser).toBeUndefined();
  });

  it('should skip auth check on OIDC callback page', async () => {
    const { getInitialState } = await import('./app');
    mockHistory.location = {
      pathname: '/oidc-callback',
      search: '',
      hash: '',
    };

    const state = await getInitialState();

    expect(mockGetUser).not.toHaveBeenCalled();
    expect(state.settings).toEqual({ navTheme: 'light' });
    expect(state.currentUser).toBeUndefined();
  });

  it('should include default settings in initial state', async () => {
    const { getInitialState } = await import('./app');
    mockGetUser.mockResolvedValue({
      expired: false,
      profile: { sub: 'user-1', name: 'User' },
    });

    const state = await getInitialState();

    expect(state.settings).toEqual({ navTheme: 'light' });
  });

  it('should use name fallback when preferred_username is not available', async () => {
    const { getInitialState } = await import('./app');
    mockGetUser.mockResolvedValue({
      expired: false,
      profile: {
        sub: 'user-456',
        name: 'Fallback Name',
      },
    });

    const state = await getInitialState();

    expect(state.currentUser).toEqual({
      name: 'Fallback Name',
      userid: 'user-456',
    });
  });
});
