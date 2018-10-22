(function($,ko){
    var GameModel = function(obj){
        //卡片图标
        this._initIcons = obj.icons.concat(obj.icons);
        this.icons = ko.observableArray(this.shuffle(this._initIcons));
        //游戏时间
        this._time = obj.leftSecond;
        this.leftSecond = ko.observable(this._time);
        //游戏评分，初始三颗星
        this.score = 3;
        //每组比较的第一个卡片索引，默认-1
        this.compareVal = -1;
        //开始游戏按钮文字
        this.playBtnPlay = 'play';
        this.playBtnPlayAgain = 'play again';
        this.playBtnText = ko.observable(this.playBtnPlay);
        //卡片翻转效果
        this.cardAnimate_in = obj.cardAnimate_in;
        this.cardAnimate_out = obj.cardAnimate_out;
        //匹配错误动画
        this.cardAnimate_incorrect = obj.cardAnimate_incorrect;
        //已匹配图标
        this.finded = '';
        this.findedCount = 0;
        //计时器id
        this._timeInterval;
        //所选中卡片边框样式
        this.selectedCardClass = 'active';
        //
        this.gameScore = obj.gameScore;
        //玩家所花费时间
        this.playerSpendTime = ko.observable('');
        //玩家得分
        this.playerScores = ko.observableArray([]);
        //是否已成功
        this.playerIsSuccess = false;
        this.backSpaceKeyEvent();
    };
    /**
     * 开始游戏
     * @return {[type]} [description]
     */
    GameModel.prototype.play = function(){
        $('#gameShadeDiv').hide();
        //解绑空格事件
        $(document).unbind('keydown',this.backSpaceKeyEvent);
        $('#gameCards>div:first-child').addClass(this.selectedCardClass).siblings().removeClass(this.selectedCardClass);
        //绑定left right up down enter事件
        $(document).keydown(this.keyEvent.bind(this));
        //计时开始
        this.setCalcula(this);
        if(this.playBtnText() === this.playBtnPlayAgain ){
            //play again
            this.resetGame();
        } else {
            this.cardMouseEnterEvent();
        }
    };
    /**
     * 重置游戏
     * @return {[type]} [description]
     */
    GameModel.prototype.resetGame = function(){
        this.leftSecond(this._time);
        this.icons(this.shuffle(this._initIcons));
        this.finded = '';
        this.findedCount = 0;
        this.compareVal = -1;
        this.playerIsSuccess = false;
        this.icons().forEach(function(item){
            $('.'+item).removeClass(item);
            var _i = item.replace('fa-','');
            $('.'+_i).removeClass(_i);
        });
        this.backSpaceKeyEvent();
    };
    /**
     * 卡片鼠标悬浮事件
     * @return {[type]} [description]
     */
    GameModel.prototype.cardMouseEnterEvent = function(){
        var _seclass = this.selectedCardClass;
        var _mouseEnter = function(){
            if($(this).hasClass()){
                return;
            } else {
                $(this).addClass(_seclass).siblings().removeClass(_seclass);
            }
        };
        $('#gameCards>div').mouseenter(_mouseEnter);
    };
    /**
     * 卡片单击事件
     * @return {[type]}
     */
    GameModel.prototype.cardClick = function(data,event){
        var _ele = event.currentTarget,
            _eleI = _ele.children[0];
        if( !$(_eleI).hasClass(data)){
            //显示卡片
            $(_ele).addClass(data.replace('fa-',''));
            $(_eleI).addClass(data);
            //获取所点击卡片的索引
            var _eleIndex = $(_ele).parent().index();
            if( this.compareVal === -1){
                //保存每组匹配首次点击卡片的索引
                this.compareVal = _eleIndex;
            } else {
                //是否匹配
                if( this.icons()[this.compareVal] !== this.icons()[_eleIndex]){
                    //不匹配，重置卡片
                    $(_ele).addClass(this.cardAnimate_incorrect);
                    $('#gameCards>div:eq('+this.compareVal+')').find('a').addClass(this.cardAnimate_incorrect);
                    setTimeout(
                        this.closeCard.bind(this,[this.compareVal,_eleIndex])
                        ,1000);
                } else {
                    this.finded += data;
                    if( ++this.findedCount === this.icons().length/2) {
                        this.playerIsSuccess = true;
                        //全部匹配
                        this.gameOver();
                    }
                }
                this.compareVal = -1;
            }
        } else {
            if( this.finded.indexOf(data) < 0){
                $(_ele).removeClass(data.replace('fa-',''));
                $(_eleI).removeClass(data);
                this.compareVal = -1;
            }
        }
    };
    /**
     * 不匹配，卡片初始化时样式变化
     * @param  {[type]} indexArray [需要隐藏卡片的索引数组]
     * @return {[type]}       [description]
     */
    GameModel.prototype.closeCard = function(indexArray){
        var _i = this.icons(),
            _incor = this.cardAnimate_incorrect;
        _function = function(itemNum){
            var _a = $(`#gameCards>div:eq(${itemNum})`).find('a');
            _a.removeClass(_i[itemNum].replace('fa-',''))
                .removeClass(_incor)
                .find('i')
                .removeClass(_i[itemNum]);
        };
        indexArray.forEach(_function);
    };
    /**
     * 洗牌
     * @param  {Array}
     * @return {Array}
     */
    GameModel.prototype.shuffle = function(icons){
        var m = icons.length, t, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = icons[m];
            icons[m] = icons[i];
            icons[i] = t;
        }
        return icons;
    };
    /**
     * 设定计时器
     * @return {[type]} [description]
     */
    GameModel.prototype.setCalcula = function(gameobj){
        if(gameobj._timeInterval){
            clearInterval(gameobj._timeInterval);
        }
        var _cal = setInterval(function(){
            gameobj.leftSecond() === 0 ?
                gameobj.gameOver()
                :
                gameobj.leftSecond(gameobj.leftSecond() - 1);
        },1000);
        gameobj._timeInterval = _cal;
    };
    /**
     * 游戏结束，统计分数
     * @return {[type]} [description]
     */
    GameModel.prototype.gameOver = function(){
        clearInterval(this._timeInterval);
        $('#gameShadeDiv').show().find('.conc-scoreDiv').removeClass('hide');
        this.playBtnText(this.playBtnPlayAgain);
        $(document).unbind('keydown');
        this.backSpaceKeyEvent();
        //
        var _st = this._time - this.leftSecond();
        this.playerSpendTime(_st);
        if( _st <= 20){
            this.playerScores(['fa-star','fa-star','fa-star']);
        } else if( _st > 20 && _st <= 40){
            this.playerScores(['fa-star','fa-star','fa-star-o']);
        } else if(_st > 40 && this.playerIsSuccess){
            this.playerScores(['fa-star','fa-star-o','fa-star-o']);
        } else {
            //失败
            this.playerScores(['fa-star-o','fa-star-o','fa-star-o']);
        }
    };
    /**
     * 绑定键盘操作
     * @return {[type]} [description]
     */
    GameModel.prototype.keyEvent = function(e){
        switch(e.keyCode){
            case 37:
                this.direKeyEvent('left');
                break;
            case 39:
                this.direKeyEvent('right');
                break;
            case 38:
                this.direKeyEvent('up');
                break;
            case 40:
                this.direKeyEvent('down');
                break;
            case 13:
                this.enterKeyEvent();
                break;
            case 32:
                break;
        }
    };
    /**
     * 空格键事件
     * @return {[type]} [description]
     */
    GameModel.prototype.backSpaceKeyEvent = function(){
        var _backSpace = function(e){
            if(e.keyCode === 32){
                this.play();
            }
        };
        $(document).keydown(_backSpace.bind(this));
    };
    /**
     * enter键事件
     * @return {[type]} [description]
     */
    GameModel.prototype.enterKeyEvent = function(){
        $('#gameCards>div.'+this.selectedCardClass).find('a').click();
    };
    /**
     * 上下左右键事件
     * @param  {[type]} dire [description]
     * @return {[type]}      [description]
     */
    GameModel.prototype.direKeyEvent = function(dire){
        var _index = $('#gameCards>div.'+this.selectedCardClass).index();
        if('left' === dire){
            _index = _index == 0 ? -1 : _index - 1;
        } else if('right' === dire){
            _index = _index == 15 ? -1 : _index + 1;
        } else if('up' === dire){
            _index = _index < 4 ? _index + 12 : _index - 4;
        } else if('down' === dire){
            _index = _index < 11 ? _index - 12 : _index + 4;
        }
        if(_index != -1){
            $('#gameCards>div:eq('+_index+')').addClass(this.selectedCardClass)
                .siblings().removeClass(this.selectedCardClass);
        }
    };
    var cg = new GameModel({
        icons: ['fa-facebook-official','fa-qq','fa-weixin','fa-google','fa-amazon','fa-apple','fa-linkedin','fa-twitter'],
        leftSecond: 60,
        cardAnimate_in: 'flipInX',
        cardAnimate_incorrect: 'wobble',
        playerScoreClass: 'conc-score',
        gameScoreBlank: 'fa-star-o',
        gameScore: 'fa-star'
    });
    ko.applyBindings(cg,document.getElementById('concGameBindObj'));
})($,ko);