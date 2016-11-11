$(document).ready(function(){
  
  //ajax
  function loadMe(){
    $.get( 'https://pro-to-tip.github.io/siri/frame.html', function(data) {
    $('.content').html(data);});
    $('.load').hide();
  };
  
  //kicks things off
  $('.action').on('click', '.load', function(){
    //starts load animation
    $(this).find('p')
      .html('');
    $(this).addClass('bar');
    //sim load time and run ajax function
    setTimeout(loadMe, 3000);
  });
  
  //restarts demo
  $('.content').on('click', '.reset', function(){
    $('.content').html("");
    $('.load').removeClass('bar')
      .find('p')
      .html('Load It');
    $('.load').fadeIn();
  });
  
});
