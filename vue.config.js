module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://timemeetyou.com:8889',
        changeOrigin: true
      }
    }
  },
  lintOnSave: false
}
