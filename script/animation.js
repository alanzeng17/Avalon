/*
* Author: Alan Zeng
* This file is used to setup the information needed to set up the game(time/#players)
* Also runs the transition and animations for
*/

//Global Variables
//as of now, time is not used
var time = null;
var newTime = null;
var numPlayers = null;
var morgana = null;
var oberon = null;
var playerArr = [];

//Helper methods

/**
* Method to transition HTML code dynamically
*/
function transition(fromId, newDiv, toId) {
  $(fromId).fadeOut(1, function () {
  $(fromId).replaceWith(newDiv);
  $(toId).fadeIn(1);
  });
}
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
* Currently unused.
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
* Creates an array of the names of all players
*/
function createPlayerArray() {
  var temp = document.getElementsByClassName('textfield');
  for(var i = 0; i < numPlayers; i++) {
    playerArr.push(temp[i].value);
  }

}


/*
* Main start screen runner
*/
var main = function() {

  //1st page, Game mode selection
  //When new game button is clicked, run this function
  $("#ngButton").click(function() {

      var sButtons = "<div id= secondButtons class = wrapper><input class='myButton' type='button' id='onlineButton' value='Play Online'><input class='myButton' type='button' id='papButton' value='Pass and Play'></div>";

      //animation to go to second part(name entry/game select)
      /*$("#button").fadeOut("slow", function () {
      var div =$(sButtons).hide();
      $("#button").replaceWith(div);
      $("#secondButtons").fadeIn(550);});*/

      var div =$(sButtons).hide();
      transition("#button",div,"#secondButtons");

      //!add a back button animation!

      $("#helpDiv").replaceWith("<div id='helpDiv' class='wrapper'><p id= 'helpText'>Pass and Play: Play with your friends using one device.<br>Play Online: Join an existing lobby</p></div>");

  });
  $("#jgButton").click(function() {
    alert("Sorry, online play is still in development. Please visit https://github.com/alanzeng17/Avalon for updates on progress.");
  });
    $("#helpButton").click(function () {
      $("#helpDiv").fadeToggle("slow");

  });


  //!add a back button click function!

  //Second page, Game mode selection pt.2
  $(document).on('click', '#papButton', function() {
    var params = "<div id = 'params' class=container>" +
"<label for='select'>Number of Players:</label><select id = 'players' value = 'select'><option value = 'x'> --Select Number-- </option><option value = '7'> 7 </option><option value = '8'> 8 </option><option value = '9'> 9 </option><option value = '10'> 10 </option></select>" +
"<br><br><label>Enable Morgana Role</label><input type='checkbox' id = morgana class = roleCheckbox><br><br><label>Enable Oberon Role</label><input type='checkbox' id = oberon class = roleCheckbox><br><br><button id='nextButton' class = myButton>Next</button></div>";

//<label for = 'time'> Set the time limit for each round: </label><select id = 'time' value = 'time'><option value = 'xx'> --Select Time-- </option><option value = 'NL'> No Limit </option><option value = '60'> 1:00 </option><option value = '90'> 1:30 </option><option value = '120'> 2:00 </option><option value = '150'> 2:30 </option><option value = '180'> 3:00 </option><option value = '210'> 3:30 </option><option value = '240'> 4:00 </option><option value = '270'> 4:30 </option>  <option value = '300'> 5:00 </option><option value = '330'> 5:30 </option><option value = '360'> 6:00 </option><option value = '390'> 6:30 </option></select>

    /*$("#secondButtons").fadeOut("slow", function () {
      var div =$(params).hide();
      $("#secondButtons").replaceWith(div);
      $("#params").fadeIn(550);
    });*/
    var div =$(params).hide();
    transition("#secondButtons",div,"#params");

  });
  $(document).on('click', '#onlineButton', function() {
    alert("Sorry, online play is still in development. Please visit https://github.com/alanzeng17/Avalon for updates on progress.");
    //#1. Trasition to a screen w/ 2 buttons, Create Lobby, Join Lobby
  });


  //Third Page, settings selection
  $(document).on('click', "#nextButton", function() {


    //Scan vals
    //time = getSelectedText("time");
    numPlayers = getSelectedText("players");
    morgana = $("#morgana:checked").val();
    oberon = $("#oberon:checked").val();

    //Check validity
    if(numPlayers[0] === '-') {
      alert("Please fill in the Number of Players");
    }
    else {
      //timeConversion();

      //Help change
      $("#helpDiv").replaceWith("<div id='helpDiv' class='wrapper'><p id= 'helpText'>Enter the players' names in order of position.</p></div>");

      //Textfield transition
      var fields = "<div id = 'nameEntry' class='wrapper'><form id = 'nameForm'>";
      var count = 1;
      while(count <= numPlayers) {
        fields = fields.concat("Player "+ count + " name:<input type='text' class = 'textfield'><br><br>");
        count++;
      }
      fields = fields.concat("</form><button id = 'sgButton' class = 'myButton'>Start Game</button></div>");

      //animation to go to second part(name entry/game select)
     /*$("#params").fadeOut("slow", function () {
      var div =$(fields);
      $(this).replaceWith(div);
      $("#nameEntry").fadeIn(550);
    });*/
      var div =$(fields);
      transition("#params",div,"#nameEntry");



    }

  });




}

//standard necessary jquery
$(document).ready(main);
