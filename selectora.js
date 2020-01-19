var currentBoxNumber = 0;
var textboxes;
var nextBox;

(function($) {

    "use strict";

    jQuery('.form-control').keyup(function (event) {
    if (event.keyCode == 13) {
        textboxes = $(".form-control");
        currentBoxNumber = textboxes.index(this);
        console.log(textboxes.index(this));
        if (textboxes[currentBoxNumber + 1] != null) {
            nextBox = textboxes[currentBoxNumber + 1];
            nextBox.focus();
            nextBox.select();
            event.preventDefault();
            return false;
        }
    }
});
})(jQuery);
