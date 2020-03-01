var current
$('.gallery .row').find('img').click(function(){
  console.log($(this).attr("src"))
  $('.modal .modal-body img').attr("src",$(this).attr("src"))
  $('.modal').modal('show')
  current = $(this)
})

$('.modal .switch').children().eq(0).click(function(){
  console.log(current.parent().prev().find('img'))
  if(current.parent().prev().find('img')[0]){
    current = current.parent().prev().find('img')
  }
  
  $('.modal .modal-body img').attr("src",current.attr("src"))
})
$('.modal .switch').children().eq(1).click(function(){
  if(current.parent().next().find('img')[0]){
    current = current.parent().next().find('img')
  }
  $('.modal .modal-body img').attr("src",current.attr("src"))
})