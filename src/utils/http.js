class Http {
    constructor() {
        this.instance = null // 类的实例
        this.config = {method: 'POST', responseType: 'JSON'}
    }

   static create (instanceConfig) {
        const that = Http.getInstance();

        // 创建实例的时候添加基本配置
        that.config = {
          ...that.config,
          ...instanceConfig
        }

        return that;
    }

    // 单例
    static getInstance() {
        if (!this.instance) {
            this.instance = new Http()
        }
        return this.instance
    }

    getData (options) {
        const requsetOptions = {
            ...this.config,
            ...options
        }
        return dispatchRequest(requsetOptions)
    }
}



/**
 *
 *
 * @author GuoXi
 * @date 2019-09-18
 * @param {*} config = {baseUrl: null, url: null, type: 'POST', header: {}}
 * @returns
 */
function dispatchRequest (config) {

    return new Promise((resolve, reject) => {
        wx.request({
            ...config,
            url: config.baseUrl + config.url,
            success: res => {
                resolve(res)
            },
            fail: res => {
                reject(res)
            }
        })
    })
}


