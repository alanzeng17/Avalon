/*
* Author: Alan Zeng
* This file is used to setup the information needed to set up the game(time/#players)
* Also runs the transition and animations for
*/

//Global Variables
var time = null;
var newTime = null;
var numPlayers = null;


/*
* Method to return the text of a given element id
*/
function getSelectedText(elementId) {
    var elt = document.getElementById(elementId);

    if (elt.selectedIndex == -1)
        return null;

    return elt.options[elt.selectedIndex].text;
}
/*
* Converts the time in x:x0 format to seconds
*/
function timeConversion() {
  if(time[0] === 'N') {
    newTime = -1;
    time = -1;
  } else {
    newTime = (time[0]*60) + (time[2]*10);
  }
}
/*
* Main start screen runner
*/
var main = function() {
  //When new game button is clicked, run this function
  $("#ngButton").click(function() {
      time = getSelectedText('time');
      numPlayers = getSelectedText('players');

      if(time[0] === '-' || numPlayers[0] === '-') {
        alert("Please select the time and number of players.");
      }
      else {
        timeConversion();

        //creates the entry fields based on given data
        var fields = "<div id = 'nameEntry' class='wrapper'><form id = 'nameForm'>";
        var count = 1;
        while(count <= numPlayers) {
          fields = fields.concat("Player "+ count + " name:<input type='text' class = 'textfield'><br><br>");
          count++;
        }
        fields = fields.concat("</form><br><input class='myButton' type='button' id='onlineButton' value='Play Online'><input class='myButton' type='button' id='papButton' value='Pass and Play'></div>");
        $("#mySubmit").click(function() {
          var playerArr = document.getElementsByClassName('textfield');
        });

        //animation to go to second part(name entry/game select)
        $("#params").fadeOut("slow");
        $("#button").fadeOut("slow", function () {
        var div =$(fields).hide();
        $(this).replaceWith(div);
        $("#nameEntry").fadeIn(550);

        //!add a back button animation!
      });

    }
  });
  $("#jgButton").click(function() {
    alert("Sorry, online play is still in development. Please visit https://github.com/alanzeng17/Avalon for updates on progress.");
  });
    $("#helpButton").click(function () {
      $("#helpDiv").fadeToggle("slow");

  });


  //!add a back button click function!



}

//standard necessary jquery
$(document).ready(main);
