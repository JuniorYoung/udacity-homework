import view from './view.js';

class ViewModel{
    constructor() {
        const self = this;
        this.initOver = ko.observable(false);//是否初始化完毕
        this.showWeather = ko.observable(false);//显示天气
        this.city = ko.observable('');//城市
        this.weather = ko.observable('');//气象
        this.dayTemp = ko.observable('');//最低温度
        this.nightTemp = ko.observable('');//最高温度

        this.activeLocationType = ko.observable('');//当前选择的地点类别(住宿、餐饮等)
        this.searchText = ko.observable('');//查询关键字
        this.locationTypes = ko.observableArray([]);//地点类别集合

        //控制数据面板是否显示
        this.showLocations = ko.observable(false);//地点查询结果列表
        this.showAutoComplete = ko.observable(false);//自动提示列表
        this.showSearchHistory = ko.observable(false);//搜索历史记录列表

        this.changeSearchTextByHistory = false;
        
        this.autoCompleteRes = ko.observableArray([]);//自动提示数据
        this.searchHistory = ko.observableArray(JSON.parse(localStorage.getItem('searchHistory') || '[]')); //搜索历史记录，页面仅显示前十条
        //根据查询关键字的实时变化匹配自动提示数据
        this.searchText.subscribe(function(newValue) {
            if(!self.changeSearchTextByHistory) {
                view.autoComplete(newValue);
            }
        });
    }
    /**切换地点类别 */
    switchLocationType(data) {
        const {name, alias} = data;
        view.placeSearch(true, alias, '');
    }
    /**
     * 点击搜索历史记录和自动提示查询
     * @param {String} text 
     */
    searchLocalHistory(text) {
        this.changeSearchTextByHistory = true;
        this.searchText(text);
        this.search();
    }
    /**关键字搜索 */
    search() {
        const _st = this.searchText();
        if(_st.trim().length != 0) {
            this.searchHistory.remove(_st);
            this.searchHistory.unshift(_st);
            localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory()));
            view.placeSearch(false, '', this.searchText());
        }
    }
    /**输入框获得焦点 */
    searchFocus() {
        if(this.searchText().trim() === '') {
            let _sh = localStorage.getItem('searchHistory');
            if(_sh !== null) {
                this.showSearchHistory(true);
            } else {
                this.showLocations(true);
            }
        } else {
            this.showLocations(true);
            this.showAutoComplete(false);
            this.showSearchHistory(false);
        }
    }
    /**清除搜索历史记录 */
    clearHistory() {
        this.showSearchHistory(false);
        this.searchHistory([]);
        localStorage.removeItem('searchHistory');
    }
};
const viewModel = new ViewModel();
export default viewModel;