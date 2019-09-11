Component({
    properties: {},
    data: {
        list: []
    },
    methods: {},
    lifetimes: {
        attached () {
            console.log('active....')
            const app = getApp();
          app.watch('activeList', [], (val) => {
            this.setData({list: val});
          })
          console.log('active app', app)
        }
    }
})