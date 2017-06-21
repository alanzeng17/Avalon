var time = null;
var numPlayers = null;
function getSelectedText(elementId) {
    var elt = document.getElementById(elementId);

    if (elt.selectedIndex == -1)
        return null;

    return elt.options[elt.selectedIndex].text;
}
var main = function() {

  $(".new-game-button").click(function() {
      time = getSelectedText('time');
      numPlayers = getSelectedText('players');
      var fields = "<form>";
      var count = 1;
      while(count <= numPlayers) {
        fields = fields.concat("Player "+ count + " name:<input type='text' class = 'textfield'>");
        count++;
      }
      fields = fields.concat("</form><input type='submit' id='mySubmit' value='Submit'>");
      $("#mySubmit").click(function()) {
        var playerArr = document.getElementsByClassName('class_name');
      }
    /*$("#button").fadeOut("slow", function () {
      var div =$("<div id = 'button' class='wrapper'>hello</div>").hide();
      $(this).replaceWith(div);
      $("#button").fadeIn("slow");
    });*/

  });



}

$(document).ready(main);
