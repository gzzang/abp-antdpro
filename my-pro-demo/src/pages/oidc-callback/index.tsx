import { handleCallback } from '@/utils/auth';
import { history } from '@umijs/max';
import { Spin } from 'antd';
import { useEffect } from 'react';

const OidcCallback: React.FC = () => {
  useEffect(() => {
    handleCallback()
      .then((user) => {
        const redirectPath = (user?.state as string) || '/welcome';
        history.replace(redirectPath);
      })
      .catch((err) => {
        console.error('OIDC callback error:', err);
        history.replace('/welcome');
      });
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spin size="large" tip="登录中..." />
    </div>
  );
};

export default OidcCallback;
