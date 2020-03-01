  // 设备监听
  window.onload = function () {

    if (window.screen.width <= 360) {
     $('nav.navbar').addClass('active')
     window.removeEventListener('scroll', nav)
    } else {
     $('nav.navbar').removeClass('active')
    }
   }
   window.onresize = function () {
    if (window.screen.width <= 360) {
     $('nav.navbar').addClass('active')
     window.removeEventListener('scroll', nav)
    } else {
     $('nav.navbar').removeClass('active')
     window.addEventListener('scroll', nav)
    }
   }
   // 导航条滚动监听
   window.addEventListener('scroll', nav)
 
   function nav() {
    if (window.scrollY > 5) {
     // console.log('xxx')
     $('nav.navbar').addClass('active')
    } else {
     $('nav.navbar').removeClass('active')
    }
   }
 
   // <!-- Business // slideToggle-->
 
   $('.row-top').find('dt').each(function (index, element) {
    $(element).next('dd').slideUp()
    // console.log(element)
    $(element).click(function () {
     // $(element).next('dd').slideToggle();
     $(element).next('dd').slideToggle(300).end().parent().siblings().find('dd').slideUp();
     $(element).toggleClass('active').parent().siblings().find('dt').removeClass('active')
 
 
    })
   })
 
 
 
   //  选项卡
   $('section.business .tabs .content>li').each(function (i, e) {
    console.log(e)
    // $(e).width()= $('section.business .tabs').width()
    $(e).css('width', $('section.business .tabs').width() + 'px')
    $('section.business .tabs .content').css('width', $(e).width() * 3 + 'px')
   })
 
 
   // 初始化
   $('section.business .tabs .switch-tab>li').each(function (i, e) {
    if (i == 0) {
     $(e).addClass('active')
    }
    $(e).click(function () {
     $(e).addClass('active').siblings().removeClass('active')
     $('section.business .tabs .content').animate({
      left: -i * $('section.business .tabs .content>li').eq(0).width() + 'px'
     }, function () {
 
     })
    })
   })
 
  // // banner按钮
   // $('section.banner .btn a').mouseenter(function () {
   //   // console.log('xxx')
   //   $('section.banner .btn').find('a').css('color', '#2ee7bc')
   // })
   // $('section.banner .btn').mouseleave(function () {
   //   console.log('xxx')
   //   $('section.banner .btn').find('a').css('color', 'white')
   // })