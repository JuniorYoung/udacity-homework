var EACH_COLWIDTH = 101, //每列宽度
    EACH_ROWHEIGHT = 83, //每行高度
    ROCK_X = 305,
    ROCK_Y = 305, //岩石坐标
    STAR_X = 400,
    STAR_Y = -5, //星星坐标
    gameModel, //游戏模型
    allEnemies, //把所有敌人的对象都放进一个叫 allEnemies 的数组里面
    player, // 把玩家对象放进一个叫 player 的变量里面
    beforeGameParam = {}; //保存游戏开始之前供玩家选择的配置

//初始化游戏类
var Game = function(obj){
  //游戏是否结束 true 结束 false 未结束
  this.status = false;
  //游戏难度 easy normal hard
  this.diff = obj.diff;
};
//游戏结束
Game.prototype.gameOver = function() {
  this.status = true;
  $('#playerDeadPageDiv').show();
  var _img = '';
  if(player.isDead){
    _img = 'images/lose.png';
  } else if(player.isWin){
    _img = 'images/win.png';
  }
  $('.game-gameOverImg img').attr('src',_img);
};
//重置游戏
Game.prototype.reset = function() {
  player.reset();
  this.status = false;
  allEnemies = this.getAllEnemies();
  $('#playerDeadPageDiv').hide();
  engineMain();
};
//根据游戏难度决定虫子数量
Game.prototype.getAllEnemies = function(){
  var diff = this.diff,
      earray = [
        new Enemy( { x: 0, y: 1, speed: 170, direStatus: 'right' }),//第一行
        new Enemy( { x: 5, y: 2, speed: 150, direStatus: 'left' }),//第二行
        new Enemy( { x: 0, y: 3, speed: 120, direStatus: 'right' })//第三行
      ];
  if(diff === 'easy'){
    return earray.slice(0,1);
  } else if(diff === 'normal'){
    return earray.slice(0,2);
  } else if(diff === 'hard'){
    return earray;
  }
};
// 这是我们的玩家要躲避的敌人
var Enemy = function(obj) {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多
    // 敌人的图片，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
    //坐标
    this.x = obj.x * EACH_COLWIDTH;
    this.y = obj.y * EACH_ROWHEIGHT - 20;
    //速度
    this.speed = obj.speed;
    //方向 right or left
    this.direStatus = obj.direStatus;
};
// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    //检测是否到边缘。若是，bug反转，往相反方向运动
    if (this.x >= (4 * EACH_COLWIDTH)){
      this.direStatus = 'left';
    } else if (this.x <= 0){
      this.direStatus = 'right';
    }
    if(this.direStatus === 'right'){
      this.x += (this.speed * dt);
    } else if (this.direStatus === 'left'){
      this.x -= (this.speed * dt);
    }
    //更新位置后检测是否与玩家碰撞,true-碰撞,false-没碰撞
    if(this.checkCollisions()){
      player.isDead = true;
      gameModel.gameOver();
    }
};
// 虫子与玩家碰撞检测 true-碰撞 false-没碰撞
Enemy.prototype.checkCollisions = function() {
  //玩家与虫子坐标
  var _e_x = this.x,
      _e_y = this.y,
      _p_x = player.x;
      _p_y = player.y;
  // console.log("enemy:",_ex,_ey,"player:",_px,_py);
  var _x = _e_x - _p_x,
      _abs_x = Math.abs(_x),
      _y = _e_y - _p_y,
      _abs_y = Math.abs(_y),
      _rock = (_abs_x > (player.CHECH_X - 20))
            || (
                (_y > 0 && _y > (player.CHECK_UP_Y-30))
                || (_y < 0 && _abs_y > (player.CHECK_DOWN_Y-30))
            );
  return !_rock;
};
// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    if(this.direStatus === 'left'){
      this.sprite = 'images/enemy-bug-left.png';
    } else if(this.direStatus ==='right'){
      this.sprite = 'images/enemy-bug.png';
    }
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
/**
 * obj: 起始配置
 */
var Player = function(obj) {
  this.CHECH_X = 87;
  this.CHECK_UP_Y = 62;
  this.CHECK_DOWN_Y = 100;
  this.NOTCHANGE_X = obj.x * EACH_COLWIDTH;
  this.NOTCHANGE_Y = obj.y * EACH_ROWHEIGHT;
  //坐标
  this.x = this.NOTCHANGE_X;
  this.y = this.NOTCHANGE_Y;
  //速度
  this.speed = obj.speed;
  //移动方向
  this.moveDire = '';
  //移动状态
  this.moveStatus = true;
  //是否dead
  this.isDead = false;
  //是否胜利
  this.isWin = false;
  this.sprite = obj.sprite;

};
//xyArray [x,y]
Player.prototype.update = function(xyArray) {
  this.x = xyArray[0];
  this.y = xyArray[1];
  if(this.x === STAR_X && this.y === STAR_Y){
    this.isWin = true;
    gameModel.gameOver();
  }
};
//重置玩家数据
Player.prototype.reset = function() {
  this.isDead = false;
  this.isWin = false;
  this.x = this.NOTCHANGE_X;
  this.y = this.NOTCHANGE_Y;
};
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
//判断玩家是否移动到 1)边界 2) 岩石
//返回类型为对象 {isOk: Boolean, xyArray: Array}
Player.prototype.isCanMove = function(cur_x, cur_y, dire) {
  var _border, _rock;
  switch (dire) {
    case 'left':
      cur_x -= this.speed;
      _border = cur_x > 0;
      break;
    case 'right':
      cur_x += this.speed;
      _border = cur_x < (4 * EACH_COLWIDTH);
      break;
    case 'up':
      cur_y -= this.speed;
      _border = cur_y > (EACH_ROWHEIGHT - 90);
      break;
    case 'down':
      cur_y += this.speed;
      _border = cur_y < (5 * EACH_ROWHEIGHT);
      break;
    default:
      '';
  }
  var _pw = ROCK_X - cur_x,
      _abs_pw = Math.abs(_pw),
      _ph = ROCK_Y - cur_y,
      _abs_ph = Math.abs(_ph),
      _rock = (_abs_pw > this.CHECH_X) || ((_ph > 0 && _ph > this.CHECK_UP_Y) || (_ph < 0 && _abs_ph > this.CHECK_DOWN_Y));
  return {isOk: _border && _rock, xyArray: [cur_x, cur_y]};
};
//dire: 方向
Player.prototype.handleInput = function(dire) {
  this.moveDire = dire;
  var _res = this.isCanMove(this.x, this.y, dire);
  if(_res.isOk){
      this.update(_res.xyArray);
  }
};
// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Player.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
//选择玩家
$('#startGamePlayerChoose > a').click(function(){
  if($(this).hasClass('active')){
    return;
  } else {
    $(this).addClass('active').siblings('a').removeClass('active');
    beforeGameParam.player_sprite = $(this).find('img').attr('src');
  }
});
//选择游戏困难度
$('#startGameDiffChoose > a').click(function(){
  if($(this).hasClass('active')){
    return;
  } else {
    $(this).addClass('active').siblings('a').removeClass('active');
    var diff = $(this).data('diff');
    beforeGameParam.game_diff = diff;
  }
});
//绑定开始游戏按钮事件
$('#startGameBtn').click(function(){
  //初始化游戏
  gameModel = new Game({
    diff: beforeGameParam.game_diff || 'easy'
  });
  //初始化虫子
  allEnemies = gameModel.getAllEnemies();
  //初始化玩家
  player = new Player({
    x: 0,
    y: 5,
    speed: 2,
    sprite: beforeGameParam.player_sprite || 'images/char-boy.png'
  });
  $('#startGameDiv').hide();
  initGameModel();
});
//绑定replay事件
$(document).on('click','#gameOverReplay',function(){
  gameModel.reset();
});
