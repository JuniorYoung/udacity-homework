import '../css/normalize.scss';
import '../css/font/iconfont.scss';
import '../css/main.scss';
import viewModel from './viewModel.js';
import view from './view.js';

window.onload = function() {
    view.init('container');
    ko.applyBindings(viewModel);
};