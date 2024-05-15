// app.js or agent.js
// 监听应用启动系列生命周期、插件启动、文件加载、服务启动完成等
class AppBootHook {
  constructor(app) {
    if (process.env.NODE_ENV === 'production') {
      console.log = function () {};
    }
    this.app = app;
    this.startTime = Date.now();
  }

  configWillLoad() {
    // Ready to call configDidLoad,
    // Config, plugin files are referred,
    // this is the last chance to modify the config.
  }

  configDidLoad() {
    // Config, plugin files have been loaded.
  }

  async didLoad() {
    // All files have loaded, start plugin here.
  }

  async willReady() {
    // All plugins have started, can do some thing before app ready
    this.app.logger.info('应用启动就绪...', Date.now());
  }

  async didReady() {
    // Worker is ready, can do some things
    // don't need to block the app boot.
  }

  async serverDidReady() {
    // Server is listening.
    this.app.logger.info('应用启动完毕...', Date.now());
    this.app.logger.info('启动总耗时', Date.now() - this.startTime, 'ms');
  }

  async beforeClose() {
    // Do some thing before app close.
    this.app.logger.info('应用被关闭', Date.now());
  }
}

module.exports = AppBootHook;
