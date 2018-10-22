import viewModel from './viewModel.js';

let map = Symbol('map');
let geolocation = Symbol('geolocation');
let placeSearch = Symbol('place search');
let autoComplete = Symbol('auto complete');
let districtSearch = Symbol('district search');
let weather = Symbol('weather');
let userLatLng = Symbol('user lat lng');
let userCity = Symbol('user city');
let userCitycode = Symbol('user city code');
let markers = Symbol('markers');

class View{
    constructor() {}
    /**
     * 初始化地图
     * @param {String} mapId 
     */
    init(mapId) {
        const self = this;
        self[map] = new AMap.Map(mapId, {
            resizeEnable: true
        });
        //定位 天气
        AMap.plugin(['AMap.Geolocation'], function () {
            viewModel.initOver(true);
            self[geolocation] = new AMap.Geolocation({
                timeout: 4000,
                showCircle: true,
                GeoLocationFirst: true, //优先使用浏览器定位
                extensions: 'all',
                buttonPosition: 'RB'
            });
            self[map].addControl(self[geolocation]);
            self[geolocation].getCurrentPosition();
            AMap.event.addListener(self[geolocation], 'complete', function (data) { //定位成功
                if(data.addressComponent && data.addressComponent.citycode) {
                    self[userLatLng] = data.position;
                    self[userCitycode] = data.addressComponent.citycode;
                    self[userCity] = data.addressComponent.city;
                    self.initLocationTypes();
                } else {
                    self.geoLocationError();
                }                
            });
            AMap.event.addListener(self[geolocation], 'error', function (error) { //定位出错
                if (error.info === 'NOT_SUPPORTED') {
                    alert('当前浏览器不支持定位功能');
                } else if (error.info === 'FAILED') {
                    alert('定位失败');
                    self.geoLocationError();
                }
            });
        });
        self.registerEvent();
    }
    /**定位成功，返回信息addressComponent为空时 */
    geoLocationError() {
        const self = this;
        self[map].getCity(function (res) {
            self[userCitycode] = res.citycode;
            self[userLatLng] = self[map].getCenter();
            self[userCity] = res.city;
            self.initLocationTypes();
        });
    }
    /**天气 */
    loadWeather() {
        const self = this;
        AMap.plugin('AMap.Weather', function() {
            self[weather] = new AMap.Weather();
            self[weather].getForecast(self[userCity], function(status, res) {
                if(status === null) {
                    viewModel.showWeather(true);
                    //请求成功
                    const fore = res.forecasts[0];//当天天气
                    //dayWeather 白天气象
                    //nightWeather
                    //dayTemp 白天温度
                    //nightTemp
                    viewModel.dayTemp(fore.dayTemp);
                    viewModel.nightTemp(fore.nightTemp);
                    viewModel.weather(fore.dayWeather);
                }
            });
        });
    }
    /**加载地点类别 与 默认地点 */
    initLocationTypes() {
        viewModel.city(this[userCity]);
        //天气
        this.loadWeather();
        //实际应从后台获取
        const _lts = [
            { name: '住宿', alias: '住宿服务' },
            { name: '餐饮', alias: '餐饮服务' },
            { name: '购物', alias: '购物服务'},
            { name: '商务住宅', alias: '商务住宅' }
        ];
        viewModel.locationTypes(_lts);
        this.placeSearch(true, _lts[0].alias, '');
    }
    /**
     * 自动提示
     * @param {String} text 
     */
    autoComplete(text = '') {
        if(text === '') {
            viewModel.showLocations(true);
            viewModel.showAutoComplete(false);
        } else {
            const self = this;
            if(typeof self[autoComplete] === 'undefined') {
                AMap.plugin('AMap.Autocomplete', function() {
                    let _d = document.getElementById('searchTip');
                    self[autoComplete] = new AMap.Autocomplete({
                        city: self[userCitycode],
                        citylimit: true
                    });
                    self.autoCompleteCommon(text);
                });
            } else {
                self.autoCompleteCommon(text);
            }
        }
    }
    autoCompleteCommon(text) {
        const self = this;
        self[autoComplete].search(text, function(status, result) {
            if(status === 'complete') {
                viewModel.showAutoComplete(true);
                viewModel.showSearchHistory(false);
                viewModel.autoCompleteRes(result.tips);
            } else if(status === 'error') {

            } else if(status === 'no_data') {
                self.hidePanel();
            }
        });
    }
    /**
     * 异步加载地点列表
     * @param {Boolean} isNear 是否附近查询
     * @param {String} type 类别 default ''
     * @param {String} text 关键字 default ''
     */
    placeSearch(isNear, type = '', text = '') {
        //监控对象-当前选择类别
        viewModel.showLocations(true);
        viewModel.changeSearchTextByHistory = false;
        viewModel.showAutoComplete(false);
        viewModel.showSearchHistory(false);
        viewModel.activeLocationType(type);
        const self = this;
        if( typeof self[placeSearch] === 'undefined') {
            AMap.plugin('AMap.PlaceSearch', function() {
                self[placeSearch] = new AMap.PlaceSearch({
                    type: type,
                    map: self[map],
                    pageSize: 5,
                    city: self[userCitycode],
                    citylimit: true,
                    panel: 'searchedLocationUl',
                    autoFitView: true
                });
                self.placeSearchCommon(isNear, text);
                AMap.event.addListener(self[placeSearch], 'listElementClick', function(e) {
                    const _index = e.index;
                    const _marker = self[markers][_index];
                    _marker.setAnimation('AMAP_ANIMATION_BOUNCE');
                    setTimeout(function() {
                        _marker.setAnimation('AMAP_ANIMATION_NONE');
                    }, 1000);
                });
            });
        } else {
            self[placeSearch].setType(type);
            self[placeSearch].setPageIndex(1);
            self.placeSearchCommon(isNear, text);
        }
    }
    /**
     * 
     * @param {Boolean} isNear
     * @param {String} text
     */
    placeSearchCommon(isNear, text) {
        const self = this;
        if(isNear) {
            self[placeSearch].searchNearBy(text, self[userLatLng], 3000, function(status, result) {
                self.autoAreaListHeight();
                self[markers] = self[map].getAllOverlays('marker');
                // markers.forEach(marker => {
                //     marker.setAnimation('AMAP_ANIMATION_BOUNCE');
                // });
            });
        } else {
            self[placeSearch].search(text, function(status, result) {
                self.autoAreaListHeight();
                self[markers] = self[map].getAllOverlays('marker');
            });
        }
    }
    /**注册事件 */
    registerEvent() {
        const self = this;
        window.onresize = function() {
            let res;
            if(res) clearTimeout(res);
            res = setTimeout(function() {
                 self.autoAreaListHeight();
            }, 500);
        };
        //移动端触摸开始时
        self[map].on('touchstart', function(e) {
            self.hidePanel();
        })
        //停止拖拽地图时
        self[map].on('dragend', function() {
            self.hidePanel();
        });
    }
    /**隐藏面板 搜索历史/查询地点列表/自动提示列表 */
    hidePanel() {
        viewModel.showAutoComplete(false);
        viewModel.showLocations(false);
        viewModel.showSearchHistory(false);
    }
    /**搜索结果列表高度自适应 */
    autoAreaListHeight() {
        let _bheight = document.body.clientHeight;
        const _comp = _bheight - 120;
        let _locHeight = document.getElementsByClassName('amap_lib_placeSearch')[0].clientHeight;
        document.getElementById('searchedLocationUl').style.maxHeight = 
            _locHeight && _locHeight > _comp ? _comp + 'px' : _locHeight + 'px';
    }
}
const view = new View();
export default view;