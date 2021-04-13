module.exports = {
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "Naproche Web";
      return args;
    });
  },
  pwa: {
      workboxOptions: {
          skipWaiting: true
      }
  }
};
