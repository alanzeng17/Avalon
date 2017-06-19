var h = "h";
var main = function() {

  $(".new-game-button").click(function() {

    $("#button").fadeOut("slow", function () {
      var div =$("<div id = 'button' class='wrapper'>hello</div>").hide();
      $(this).replaceWith(div);
      $("#button").fadeIn("slow");
    });

  });



}

$(document).ready(main);
