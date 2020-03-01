var stage = document.querySelector('.stage')

// document.body.onmousemove = function(event){
//   // console.log(stage.offsetTop,stage.offsetLeft)
//   var x = event.clientX-stage.offsetLeft-stage.offsetWidth/2
//   var y = event.clientY-stage.offsetTop-stage.offsetHeight/2
//   console.log(x,y)


//   stage.style.transform = 'rotateX('+-x/20+'deg) rotateY('+-y/20+'deg)'
// }
var show = true

stage.onclick = function(e){
  stage.classList.toggle('active')
  
  if(show){
    show = false;

   datas.forEach(function(e,index){
    var randomNum = Math.floor(Math.random()*200+100);
    for (var i = 0; i < e.children.length; i++) {
      if(i==0){
         e.children[i].style.transform = 'translateZ('+randomNum+'px) rotateZ(90deg)';

      }else if(i ==1){
        e.children[i].innerHTML = randomNum
        e.children[i].style.width = randomNum+'px'
      }else{
        e.children[i].style.width = randomNum+'px'
      }
      
     
      
    }
   
  
  }) 
  }else{
    datas.forEach(function(e,index){
      show= true;
      for (var i = 0; i < e.children.length; i++) {
        if(i==0){
           e.children[i].style.transform = 'translateZ(0)  rotateZ(90deg)';
        }else if(i!=0){
          e.children[i].style.width = '0'
        }
    
       
        
      }
     
    
    }) 

  }
  
}

var datas = document.querySelectorAll('.content .data span')

