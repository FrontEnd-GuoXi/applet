 // components/component-tag-name.js
Component({
    properties: {},
    data: {
      text: '',
      app: null
    },
    methods: {
      submit (event) {        
        let newList = JSON.parse(JSON.stringify(this.data.app.globalData.activeList));
        console.log(this.data.app.globalData.activeList)
        newList.push(this.data.text);
        this.data.app.globalData.activeList = newList;
        this.setData({text: ''});
      },
      setText (event) {
        console.log('...',event)
       this.setData({text: event.detail.value})
      }
    },
    lifetimes: {
      attached () {
        console.log('header....')
        const app = getApp();
        this.setData({app});
        console.log(this.data.app)
      }
    }
  })
  