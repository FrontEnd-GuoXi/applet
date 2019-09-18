const { leftData, rightData } = require('./data.js');
import { request as http, alertViewWithCancel as cAlert } from '../../utils/util.js';

Page({
    data: {
        leftList: [],
        rightList: [],
        activeId: 5,
        coordinate: 1
    },
    onLoad () {
        this.setData({ leftList: leftData.list });
        this.getRrightData(this.data.activeId, 1);
    },
    selectItem (e) {
        let activeId = e.currentTarget.dataset.idx;
        this.setData({ activeId });
    },
   async getRrightData (typeID, coordinate) {
        try {
            var parameters = `a=list&c=subscribe&category_id=${typeID}&page=${coordinate}`;
            const data = await http({parameters});
            this.setData({
                rightData: this.data.rightData.concat(data.data.list)
            });
        } catch(e) {
            cAlert('服务器错误')
        }
    }
});



