export default [
  {
    path: '/oidc-callback',
    layout: false,
    component: './oidc-callback',
  },
  {
    path: '/welcome',
    name: '欢迎',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/books',
    name: '图书管理',
    icon: 'book',
    component: './books',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './exception/404',
    layout: false,
    path: '/*',
  },
];
