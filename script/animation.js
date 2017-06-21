var time = null;
var numPlayers = null;
function getSelectedText(elementId) {
    var elt = document.getElementById(elementId);

    if (elt.selectedIndex == -1)
        return null;

    return elt.options[elt.selectedIndex].text;
}
var main = function() {

  $("#b1").click(function() {
      time = getSelectedText('time');
      numPlayers = getSelectedText('players');
      var fields = "<div id = 'nameEntry' class='wrapper'><form id = 'nameForm'>";
      var count = 1;
      while(count <= numPlayers) {
        fields = fields.concat("Player "+ count + " name:<input type='text' class = 'textfield'><br><br>");
        count++;
      }
      fields = fields.concat("</form><input class='myButton' type='button' id='b2' value='Create Lobby'><input class='myButton' type='button' id='b3' value='Pass and Play'></div>");
      $("#mySubmit").click(function() {
        var playerArr = document.getElementsByClassName('class_name');
      });


      $("#params").fadeOut("slow");
      $("#button").fadeOut("slow", function () {
      var div =$(fields).hide();
      $(this).replaceWith(div);
      $("#nameEntry").fadeIn(550);
    });

  });



}

$(document).ready(main);
