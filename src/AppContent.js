class AppContent {
  constructor() {
    let url = new URL(window.location.href)
    let originValue = `${url.origin}/api`
    // let originValue = `http://172.16.16.85:19008/api`;
    // let originValue = `http://172.16.25.152:19008/api`; http://172.16.30.36/api
    this.httpService = originValue
  }
}

export default new AppContent();
