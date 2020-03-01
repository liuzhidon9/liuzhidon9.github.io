/** @type {HTMLCanvasElement} */
document.body.addEventListener("touchmove", function (e) {
  e.preventDefault()
}, {
  passive: false
})
var canvas = document.querySelector('#canvas')
var ctx = canvas.getContext('2d')
if (window.screen.width < 480) {
  console.log(window.screen.width);
  canvas.width = window.screen.width
  canvas.height = window.screen.height
  game = {
    stageW: window.screen.width,
    stageH: window.screen.height,
    center: {
      x: window.screen.width / 2,
      y: window.screen.height / 2
    }
  }

} else {
  game = {
    stageW: canvas.width,
    stageH: canvas.height,
    center: {
      x: canvas.width / 2,
      y: canvas.height / 2
    }
  }
}


let colorArr = ['#66CCCC', '#FF99CC', '#FF6666', '#FF0033', '#FF6600', '#0099CC', '#009999', '#006699', '#99CC33',
  '#CC6600'
]
// 随机颜色
randomColor = () => {
  return colorArr[Math.floor(Math.random() * colorArr.length)]
}
// 随机数
randomNum = (m, n) => {
  return Math.round(Math.random() * (n - m) + m)
}
// 画背景
drawBg = () => {
  // ctx.beginPath()
  ctx.fillStyle = '#eaeaea'
  ctx.fillRect(0, 0, game.stageW, game.stageH)

}

// 画小球球
drawBallBall = (x, y, r, color) => {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, 2 * Math.PI)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
}


drawCircle = (x, y, r, color) => {
  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.arc(x, y, r, 0, 2 * Math.PI)
  ctx.closePath()
  ctx.stroke()
  // ctx.fill()
}
// 准备界面的小球球
let a = {
  r: 50,
  maxR: 50,
  minR: 40,
  zoom: false,
  color: randomColor()
}
let b = {
  r: 30,
  maxR: 30,
  minR: 20,
  zoom: false,
  color: randomColor()
}

let c = {
  r: 10,
  maxR: 10,
  minR: 5,
  zoom: false,
  color: randomColor()
}
// 小球球缩放
updataBall = (obj) => {

  if (!obj.zoom) {
    obj.r -= 0.3;
    obj.zoom = obj.r <= obj.minR ? true : false;
  }
  if (obj.zoom) {
    obj.r += 0.3;
    obj.zoom = obj.r >= obj.maxR ? false : true;
  }

}

//敌方球球构造器
class Ball {
  constructor(m, n) {
    this.color = randomColor();
    this.r = randomNum(m, n);
    this.over = false
  }

  // 敌方球球随机位置
  randomPosition() {
    let num = randomNum(0, 3)
    //  console.log(num)
    switch (num) {
      // 上面
      case 0:
        this.x = randomNum(-this.r, game.stageW + this.r)
        this.y = -this.r
        break;

        // 下面
      case 1:
        this.x = randomNum(-this.r, game.stageW + this.r)
        this.y = this.r + game.stageH
        break;
        // 左边
      case 2:
        this.x = -this.r
        this.y = randomNum(-this.r, game.stageH + this.r)
        break;
        // 右边
      case 3:
        this.x = this.r + game.stageW
        this.y = randomNum(-this.r, game.stageH + this.r)

        break;

    }
  }

  // 敌方小球速度
  randomSpeed() {
    if (this.x > game.stageW) {
      this.sx = -randomNum(1, 3)
      this.sy = randomNum(-3, 3)
    }
    if (this.x < 0) {
      this.sx = randomNum(1, 3)
      this.sy = randomNum(-3, 3)
    }
    if (this.y > game.stageH) {
      this.sx = randomNum(-3, 3)
      this.sy = -randomNum(1, 3)
    }
    if (this.y < 0) {
      this.sx = randomNum(-3, 3)
      this.sy = randomNum(1, 3)
    }
  }

  //敌方小球球移动
  move() {
    this.x = this.x + this.sx;
    this.y = this.y + this.sy
  }

  // 检测超出
  checkOver() {
    var bottomOver = this.y > game.stageH + this.r
    var topOver = this.y < -this.r
    var rightOver = this.x > game.stageW + this.r
    var leftOver = this.x < -this.r
    this.over = topOver || bottomOver || leftOver || rightOver
  }


}




// 玩家小球球 构造器
class PlayBall {

  x = game.center.x
  y = game.center.y;
  color = '#333333';
  r = 5;



}

//生成玩家
let player = new PlayBall()
// 分数
let score = 0
// 存活时间
let liveTime = 0

// 玩家光环
let playerCircle = new PlayBall()

// 检测碰撞
checkCrash = (ball) => {
  // 毕达哥拉斯定理（勾股定理）
  let s = Math.sqrt((ball.x - player.x) * (ball.x - player.x) + (ball.y - player.y) * (ball.y - player.y))
  if (s < ball.r + player.r && !ball.over) {
    console.log('撞上了')
    return true
  }
}

// 对比大小
checkR = (ball) => {
  if (!((ball.r - player.r) > 0)) {
    return true
  } else {
    return false
  }
}

let img = new Image()
img.src = "./preloadsheet.png";

// 画按钮
class Btn {
  constructor(x, y, btn) {
    this.x = x
    this.y = y
    this.btn = btn
  }
  drawImg() {
    ctx.beginPath()
    ctx.drawImage(img, this.btn.x, this.btn.y, this.btn.sourceW, this.btn.sourceH, this.x, this.y, this.btn.sourceW / 2, this.btn.sourceH / 2);
    ctx.closePath()
  }
  restart() {
    canvas.onclick = (e) => {
      let xClick = e.offsetX > this.x && e.offsetX < this.x + this.btn.sourceW / 2
      let yClick = e.offsetY > this.y && e.offsetY < this.y + this.btn.sourceH / 2
      console.log(e.offsetX);

      if (yClick && xClick) {
        // console.log('restart');
        location.reload()

      }
    }
  }

}


// 生成开始按钮
let startBtn = new Btn((game.stageW - file.start_btn_png.sourceW / 2) / 2, (game.stageH - file.start_btn_png.sourceH) / 2 + 50, file.start_btn_png)

// 重新开始按钮
let again = new Btn((game.stageW - file.again_btn_png.sourceW / 2) / 2, (game.stageH - file.again_btn_png.sourceH) / 2 + 150, file.again_btn_png)

// 准备界面
ready = () => {

  // 画开始界面的两个球球
  updataBall(a)
  updataBall(b)
  // console.log(a.color,b.color)
  drawBallBall(game.center.x - a.minR, game.center.y - a.maxR, a.r, a.color)
  drawBallBall(game.center.x + b.minR, game.center.y - b.maxR, b.r, b.color)
  // 吃掉比你小的球

  // 开始按钮
  startBtn.drawImg()

}

// 游戏结束存储数据
gameOver = () => {
  if (localStorage.score) {
    let dataArr = JSON.parse(localStorage.score)
    // 遍历数组
    for (const item of dataArr) {
      for (const key in item) {

        if (key == score) {
          item[key]++;
          localStorage.score = JSON.stringify(dataArr)
          return
        }


      }

    }

    let newScore = {}
    newScore[score] = 1
    dataArr.push(newScore)
    localStorage.score = JSON.stringify(dataArr)


  } else {
    let newScore = {}
    newScore[score] = 1
    localStorage.score = JSON.stringify([newScore])
  }
}

// 获取分数
getScore = () => {
  let dataArr = JSON.parse(localStorage.score)
  let total = 0
  let less = 0
  for (const item of dataArr) {
    for (const key in item) {
      if (key < score) {
        less += item[key]
      }

      total += item[key]
      // console.log(dataArr[i][key])

    }
  }

  let btn = file.balance_base_bg_png
  ctx.beginPath()
  ctx.fillStyle = 'rgba(0,0,0,0.15)'
  ctx.fillRect(0, 0, game.stageW, game.stageH)
  ctx.drawImage(img, btn.x, btn.y, btn.sourceW - 25, btn.sourceH - 5, (game.stageW - btn.sourceW / 2) / 2, (game.stageH - btn.sourceH / 2) / 2, btn.sourceW / 2, btn.sourceH / 2);
  ctx.font = '24px Arial'
  ctx.fillStyle = 'white'
  ctx.fillText(score + '个', (game.stageW - btn.sourceW / 2) / 2 + btn.sourceW / 4.5, (game.stageH - btn.sourceH / 2) / 2 + btn.sourceH / 2.8)
  ctx.fillText(parseInt(less / total * 100), (game.stageW - btn.sourceW / 2) / 2 + btn.sourceW / 3.8, (game.stageH - btn.sourceH / 2) / 2 + btn.sourceH / 2)
  // ctx.fill()
  ctx.closePath()
  // let node = document.createElement('cavas')
  again.drawImg()
  again.restart()
  console.log(total, less);

}


let iframe = 0
let ballArr = []
let get = false
// 游戏界面 
start = () => {
  // console.log('游戏开始')
  iframe++
  if (!(iframe % 10)) {
    // 生成敌方小球球
    var balls = new Ball(player.r - 3, player.r + 20)
    balls.randomPosition()
    balls.randomSpeed()
    ballArr.push(balls)


  }
  // 遍历所有小球球
  ballArr.forEach((e, i) => {

    e.move()
    drawBallBall(e.x, e.y, e.r, e.color)
    e.checkOver()

    // 检测碰撞
    if (iframe > 120) {
      if (checkCrash(e)) {
        switch (checkR(e)) {
          case true:
            player.r += e.r / 10
            ballArr.splice(i, 1)
            score++
            break;

          case false:
            get = true
            clearInterval(id)
            return;
            break;
        }

      }
    }




  })
  // 移动所有小球球  x，y不断改变
  ballArr.forEach((e, i) => {
    if (e.over) {

      // 超出从数组删除
      ballArr.splice(i, 1)

    }
  })

  // 画出玩家球球
  drawBallBall(player.x, player.y, player.r, player.color)
  if (iframe < 300) {
    updataBall(c)
    drawCircle(player.x, player.y, c.r, 'skyblue')
  }


  // 分数
  ctx.font = '20px Arial'
  ctx.fillStyle = 'black'
  ctx.fillText("得分：" + score, 20, 30)

  if (get) {
    gameOver()
    getScore()
  }

}


// 游戏主体
let id = setInterval(() => {
  //  console.log('xxx')
  // 每一帧都清除一下画布
  ctx.clearRect(0, 0, game.stageW, game.stageH)
  // 每一帧都画一次背景
  drawBg()

  // 准备界面
  if (!game.start) {
    ready()
  } else {
    start()
  }




}, 20)
canvas.onclick = (e) => {


  let xClick = e.offsetX >= startBtn.x && e.offsetX <= startBtn.x + file.start_btn_png.sourceW / 2;
  let yClick = e.offsetY >= startBtn.y && e.offsetY <= startBtn.y + file.start_btn_png.sourceH / 2;
  console.log(xClick, yClick);
  if (xClick && yClick) {

    game.start = true;
  }
  // 玩家小球球移动
  if (game.start) {
    let x = (e) => {
      player.x = e.offsetX
      player.y = e.offsetY
    }
    canvas.onmousedown = (e) => {
      let xTouch = e.offsetX >= player.x - player.r - 10 && e.offsetX <= player.x + player.r + 10;
      let yTouch = e.offsetY >= player.y - player.r - 10 && e.offsetY <= player.y + player.r + 10;
      if (xTouch && yTouch) {
        canvas.addEventListener('mousemove', x)
      }

    }
    canvas.onmouseup = () => {
      canvas.removeEventListener('mousemove', x)
    }


  }
}

if (navigator.maxTouchPoints) {
  canvas.ontouchstart = (e) => {
    // console.log(e.changedTouches[0].clientX);
    let touch = e.changedTouches[0]
    let xClick = e.offsetX >= startBtn.x && e.offsetX <= startBtn.x + file.start_btn_png.sourceW / 2;
    let yClick = e.offsetY >= startBtn.y && e.offsetY <= startBtn.y + file.start_btn_png.sourceH / 2;
    if (xClick && yClick) {

      game.start = true;
    }
    // 玩家小球球移动
    if (game.start) {
      canvas.ontouchmove = (e) => {
        console.log(e.clientX);
        player.x = e.touches[0].clientX
        player.y = e.touches[0].clientY-50
      }


    }
  }

}