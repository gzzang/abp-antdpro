export default {
  dev: {
    '/api/': {
      target: 'https://localhost:44358',
      changeOrigin: true,
      secure: false,
    },
  },
  test: {
    '/api/': {
      target: 'https://localhost:44358',
      changeOrigin: true,
      secure: false,
    },
  },
  pre: {
    '/api/': {
      target: 'https://localhost:44358',
      changeOrigin: true,
      secure: false,
    },
  },
};
