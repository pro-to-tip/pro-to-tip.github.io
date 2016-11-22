$(function(){
  var text = Prism.highlight($('.highlighter').html(), Prism.languages.javascript)
     /* $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
  var text = $(".element code").html()
  */
  console.log('text' + text)
  $(".highlighter").typed({
      strings: [text],
      contentType: 'html', // or 'text',
      cursorChar: '&#9608;'
  });

});