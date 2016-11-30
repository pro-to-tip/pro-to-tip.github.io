window.onload = function () {
    window.ya.speechkit.settings.apikey = 'efe49eed-0ce0-4482-8c14-0cf141204bd9';

    var textline = new ya.speechkit.Textline('textline', {
        onInputFinished: function (text) {
          //  alert(text);
        }
   });

    $('#get_value').bind('click', function () {
        if (textline.value() && (textline.value() !== '')) {
            console.log("Итоговый результат распознавания: " + textline.value());
        } else {
            console.log("Распознавание еще не завершено.");
        }
    });

    $('#destroy').bind('click', function () {
        textline.destroy();
        $(this).remove();
        $('#get_value').remove();
    });
};
