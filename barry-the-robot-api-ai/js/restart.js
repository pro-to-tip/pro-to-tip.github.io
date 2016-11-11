 //restarts demo
  $('.content').on('click', '.reset', function(){
    $('.content').html("");
    $('.load').removeClass('bar')
      .find('p')
      .html('Load It');
    $('.load').fadeIn();
  });
