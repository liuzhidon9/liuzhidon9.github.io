var stage = document.querySelector(".stage");
var gameStart = document.querySelector(".game-start");
var sceneGame = document.querySelector(".sceneGame");
var buttonStart = document.querySelector("button.start");
var scoreP1 = document.querySelector('.sceneGame .score .scoreP1')

buttonStart.ontouchstart = function() {
	// buttonStart.style.boxShadow = 2+'px' + +2+'px' + +20+'px'+ +'black'
	buttonStart.style.transform = "scale(0.9)";
	console.log(event);
};
buttonStart.ontouchend = function(event) {
	buttonStart.style.transform = "scale(1.1)";
	stage.style.marginLeft = -100 + "%";
	gameConfig.startGame();
};
// 我方飞机对象 对象
var typeElement = {
	path: "our-plane.gif",
	w: 66,
	h: 80,
	blood:5,
	boom:'our-plane-boom.gif'
};
// 我方子弹对象
var typeOurbullet = {
	path: "our-bullet.png",
	w: 6,
	h: 14,
	speed: -5,
	blood:1

};
// 敌方飞机 对象
var typeEnemyPlaneS = {
	path: "enemy-plane-s.png",
	boom:'enemy-plane-s-boom.gif',
	hit:'',
	w: 34,
	h: 24,
	speed: 5,
	blood:1,
	delay:10
};
var typeEnemyPlaneM = {
	path: "enemy-plane-m.png",
	boom:'enemy-plane-m-boom.gif',
	hit:'enemy-plane-m-hit.png',
	w: 46,
	h: 60,
	speed: 3,
	blood:3,
	delay:30
};
var typeEnemyPlaneL = {
	path: "enemy-plane-l.png",
	boom:'enemy-plane-l-boom.gif',
	hit:'enemy-plane-l-hit.png',
	w: 110,
	h: 164,
	speed: 2,
	blood:5,
	delay:50
};
// 游戏配置对象
function GameConfig() {
	this.gameBgPosY = 0;
	this.sceneW = innerWidth;
	this.sceneH = innerHeight;
	this.enemys = [];
	this.players = [];
}
var gameConfig = new GameConfig();
// 背景滚动方法
function gameBgRoll() {
	gameConfig.gameBgPosY++;
	sceneGame.style.backgroundPositionY = gameConfig.gameBgPosY + "px";
}

// 元素构造器
function Element(type, x, y) {
	this.path = "./images/" + type.path;
	this.boom = "./images/" + type.boom;
	this.hit =  "./images/" + type.hit;
	this.x = x;
	this.y = y;
	this.w = type.w;
	this.h = type.h;
	this.speed = type.speed;
	this.bulletArr = [];
	this.delay = type.delay;
	this.b = type.blood;
	this.blood = type.blood;
	this.die = false;
	this.score = 0
	
}
// 判断元素是否 超出顶部画布
Element.prototype.checkTopOver = function() {
	if (this.y <= -this.h / 2) {
		return true;
	}
};
// 判断两个元素是否发生碰撞
Element.prototype.checkCrash = function(other) {
	// 当血条大于0时才发生检测
	if(this.blood>0){
			// 水平碰撞
	var hCrash = Math.abs(this.x - other.x) < (this.w + other.w) / 2;
	// 竖直碰撞
	var vCrash = Math.abs(this.y - other.y) < (this.h + other.h) / 2;
	// 发生碰撞返回true 没有就返回false
	return hCrash && vCrash ? true : false;
	}

};

// 根据元素自身的位置信息 更新视图
Element.prototype.updataView = function() {
	this.node.style.top = this.y - this.h / 2 + "px";
	this.node.style.left = this.x - this.w / 2 + "px";
};

// 移动元素 更新位置 更新视图
Element.prototype.move = function() {
	this.y += this.speed;
	this.updataView();
};
// 创建节点 画出某个元素
Element.prototype.draw = function() {
	this.node = document.createElement("img");
	this.node.src = this.path;
	sceneGame.appendChild(this.node);
	// this.node.style.marginLeft = -33+'px'
	this.updataView();
};

// 创建我方飞机
GameConfig.prototype.createPlayer = function() {
	var ourPlane = new Element(typeElement, gameConfig.sceneW / 2, gameConfig.sceneH - typeElement.h / 2);
	ourPlane.draw();
	this.players.push(ourPlane);
};
gameConfig.createPlayer();
// 创建我方子弹  每架飞机都有自己的子弹
Element.prototype.createBullet = function() {
	gameConfig.players.forEach(function(player, index, players) {
		var ourbullet = new Element(typeOurbullet, player.x , player.y);
		var ourbullet1 = new Element(typeOurbullet, player.x - 20, player.y);
		var ourbullet2 = new Element(typeOurbullet, player.x + 20, player.y);
		ourbullet.draw();
		ourbullet1.draw();
		ourbullet2.draw();
		player.bulletArr.push(ourbullet,ourbullet1, ourbullet2);
	});
};

// 移动所有子弹的位置

Element.prototype.updataAllBullet = function() {
	this.bulletArr.forEach(function(bullet, index, arr) {
		bullet.move();
		if (bullet.checkTopOver()) {
			// console.log("xxx");
			sceneGame.removeChild(bullet.node); //判断 如果子弹消失就删除 子弹节点
			arr.splice(index, 1); //同时删除数组中的项
		}
	});
};

//创建敌方飞机

GameConfig.prototype.createEnemy = function(typeEnemyPlane) {
	var randomNum = Math.floor(Math.random() * gameConfig.sceneW);
	var enemyPlane = new Element(typeEnemyPlane, randomNum, -typeEnemyPlane.h / 2);
	enemyPlane.draw();
	this.enemys.push(enemyPlane);
};

// 移动敌方飞机
GameConfig.prototype.moveAllEnemy = function() {
	this.enemys.forEach(function(enemy, index, enemys) {
		enemy.move();
		if (enemy.y >= gameConfig.sceneH + enemy.h) {
			sceneGame.removeChild(enemy.node);
			enemys.splice(index, 1);
		}
	});
};

// 遍历所有敌方我方飞机以及子弹  检测是否发生碰撞
GameConfig.prototype.checkAllCrash = function(){
	gameConfig.enemys.forEach(function(enemy,ie,enemys){
		gameConfig.players.forEach(function(player,ip,players){
			player.bulletArr.forEach(function(bullet,ib,bulletArr){
				if(enemy.checkCrash(bullet)){
					enemy.blood--
					bullet.blood--
				}
			})
			if(enemy.checkCrash(player)){
				enemy.blood = 0
				player.blood--
			}
		})
	})
}

// 检测敌机和我方飞机及子弹的所有血条
GameConfig.prototype.checkAllBlood= function(){
	gameConfig.enemys.forEach(function(enemy,ie,enemys){
		if (enemy.blood<enemy.b && enemy.blood>0){
			console.log('xxx')
			enemy.node.src = enemy.hit;
		}else if(enemy.blood<= 0&& !enemy.die){ //条件成立只运行一次  这样不会每帧刷新 有爆炸效果
			enemy.die = true
			// 标记死亡
			enemy.node.src = enemy.boom;
			// 换爆炸图
		}else if(enemy.blood<= 0){
			enemy.delay--
			if(enemy.delay<=0){
				// 当延时过了  就删DOM  清数组
				sceneGame.removeChild(enemy.node)
				enemys.splice(ie,1)
			}
		}
	})
	gameConfig.players.forEach(function(player,ip,players){
		player.bulletArr.forEach(function(bullet,ib,bulletArr){
			if(bullet.blood<= 0){
				sceneGame.removeChild(bullet.node)
				bulletArr.splice(ib,1)
				// 加分
				player.score++
				scoreP1.innerText ='得分：' +player.score;
			}
		})
		if(player.blood<= 0){
			player.node.src  = player.boom;
			gameConfig.pause();
		}
	})
}

// 触摸移动的时候更新飞机的位置 每移动一下就更新一下 ourPlane 里面的x,y
sceneGame.ontouchmove = function(e) {
	// console.log(e.touches[0].clientX);
	gameConfig.players.forEach(function(player, index, players) {
		player.x = e.touches[0].clientX;
		player.y = e.touches[0].clientY;
		player.updataView();
	});
};
var frames = 0;
// 游戏主逻辑
// 开始游戏
GameConfig.prototype.startGame = function() {
	this.setIntervalId = setInterval(function() {
		frames++;
		// 背景滚动
		gameBgRoll();

		// 每帧更新子弹位置
		gameConfig.players[0].updataAllBullet();
		// 每帧更新敌机位置
		gameConfig.moveAllEnemy();

		// 每帧判断两个元素是否碰撞
		gameConfig.checkAllCrash();
		// 每帧检测所有血条
		gameConfig.checkAllBlood()
		// 判断 ？帧就生成一颗子弹
		if (frames % 30 === 0) {
			gameConfig.players[0].createBullet();
		}
		// 判断 ？帧就生成一架敌方飞机
		if (frames % 30 === 0) {
			// 概率随机生成
			var probability = Math.floor(Math.random() * 100);
			if (probability < 5) {
				gameConfig.createEnemy(typeEnemyPlaneL);
			} else if (probability < 20) {
				gameConfig.createEnemy(typeEnemyPlaneM);
			} else {
				gameConfig.createEnemy(typeEnemyPlaneS);
			}
		}
	}, 30);
	this.state = 1;
};
// 暂停游戏
GameConfig.prototype.pause = function() {
	clearInterval(this.setIntervalId);
	this.state = 0;
};

// 开始/暂停游戏
sceneGame.ontouchstart = function(e) {
	console.log(e.touches[0].clientX, e.touches[0].clientY);
	startx = e.touches[0].clientX;
	starty = e.touches[0].clientY;
	sceneGame.ontouchend = function(event) {
		// console.log(event)
		endx = event.changedTouches[0].clientX;
		endy = event.changedTouches[0].clientY;
		console.log(endx, endy);
		// 只有按下和放开的坐标相同时  才开始判断是否开始或暂停
		if (startx === endx && starty === starty) {
			if (gameConfig.state === 0) {
				gameConfig.startGame();
			} else {
				gameConfig.pause();
			}
		}
	};
};
