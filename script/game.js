//cd Documents/Alan/Personal/Avalon
// for easy github

//temp array to get set random indexes for each role
var tempArray = null;
//Array that maps each role to a player by matching indexes
var roleArray = null;
//Array for the indexes of each non mordred spy
var spyArray = null;

//Will contain index of each role
var merlin = null;
var percival = null;
var mordred = null;

//index of the captain
var captainIndex = null;
var captainName = null;

var numSpies = 3;
var numResistance = 4;
var randomSetter = numPlayers-1;

var papCounter = 0;
var roundCounter = 1;
var teamCount = 0;

var gameTemplate = null;

/*
  Fischer-yates shuffle algorithm
  Randomly shuffles an array
*/
function shuffleArray(arr) {

    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}
/*
  Returns a random int between x and y inclusive
*/
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min+1)) + min;
}

/*
  Creates an array of Roles, with the appropriate index matching the player in the player array
*/
function createRoleArray() {

  //Initiate default values
  randomSetter = numPlayers-1;
  roleArray = ['.','.','.','.','.','.','.'];
  tempArray = ['0','1','2','3','4','5','6'];

  //Account for extra players
  for(var i = 7; i < numPlayers; i++ ) {
    tempArray.push(i);
    roleArray.push('.');
  }
  //set mordred
  var mordIndex = getRandomInt(0,randomSetter);
  mordred = tempArray[mordIndex];
  roleArray[tempArray[mordIndex]] = 'Mordred';
  tempArray.splice(mordIndex,1);
  numSpies--;
  randomSetter--;

  //set morgana if needed
  if(morgana != null) {
    var morgIndex = getRandomInt(0,randomSetter);
    roleArray[tempArray[morgIndex]] = 'Morgana';
    morgana = tempArray[morgIndex];
    tempArray.splice(morgIndex,1);
    numSpies--;
    randomSetter--;

  }

  //set oberon if needed
  if(oberon != null) {
    var obIndex = getRandomInt(0,randomSetter);
    roleArray[tempArray[obIndex]] = 'Oberon';
    oberon = tempArray[obIndex];
    tempArray.splice(obIndex,1);
    numSpies--;
    randomSetter--;
  }

  //set remaining spies
  for(var i = 0; i < numSpies; i++) {
    var spyIndex = getRandomInt(0,randomSetter);
    roleArray[tempArray[spyIndex]] = 'Spy'+(i);
    tempArray.splice(spyIndex,1);
    randomSetter--;
  }

  //set merlin
  var merlinIndex = getRandomInt(0,randomSetter);
  roleArray[tempArray[merlinIndex]] = 'Merlin';
  merlin = tempArray[merlinIndex];
  tempArray.splice(merlinIndex,1);
  numResistance--;
  randomSetter--;

  //set percival
  var percIndex = getRandomInt(0,randomSetter);
  roleArray[tempArray[percIndex]] = 'Percival';
  percival = tempArray[percIndex];
  tempArray.splice(percIndex,1);
  numResistance--;

  //set remaining civs
  for(var i = 0; i < numResistance; i++) {
    roleArray[tempArray[0]] = 'Civilian';
    tempArray.splice(0,1);
  }

}

function setTeams() {
  numSpies = 3;
  if(numPlayers > 8) {
    numSpies++;
  }
  numResistance = (numPlayers-numSpies);
}

function setIndexes() {
  spyArray = [];
  for(var i = 0; i < numSpies; i++) {
    spyArray.push(roleArray.indexOf('Spy'+i));
  }
  if(morgana != null) {
    console.log("test");
    spyArray.push(morgana);
  }
  if(oberon != null) {
    console.log("useless");
    spyArray.push(oberon);
  }
  merlin = roleArray.indexOf('Merlin');
  percival = roleArray.indexOf('Percival');
  mordred = roleArray.indexOf('Mordred');
  spyArray.push(mordred);
}
function isPlayerArrayValid() {
  for(var i = 0; i < numPlayers; i++) {
    if(playerArr[i] ==='') {
      return false;
    }
  }
  return true;
}
function checkArrayForDupes(arr) {
  for(var i = 0; i < arr.length; i++) {
    for(var j = 1; j < arr.length; j++) {
      if(i != j && arr[i] === arr[j]) {
        return false;
      }
    }
  }
  return true;

}

var main = function() {
  //End of name entry, start pass and play game
  $(document).on('click', '#sgButton',function() {
    console.log(playerArr.toString());
    createPlayerArray();
    var valid = isPlayerArrayValid();
    var dupes = checkArrayForDupes(playerArr);
    if(!valid) {
      alert("Please fill out fields for all players.");
      playerArr = [];
    } else if(!dupes) {
      alert("Please remove any duplicate names!");
      playerArr = [];
    }
    else {
      setTeams();
      createRoleArray();
      setIndexes();

      console.log(roleArray.toString());
      console.log(playerArr.toString());

      var blank = "<div id = 'blank' class = 'wrapper'><label for='captain'>Select the first Captain: </label><select id = 'cap' value = 'captain'>";
      for(var i = 0; i < playerArr.length; i++) {
        blank = blank.concat("<option value = "+ i +"> "+playerArr[i] +"</option>");
      }
      blank = blank.concat("</select><br><br>Pass to <span id='spy'>" + playerArr[0] + "</span> to begin the \"night sequence\"<br><br><button id = 'spapButton' class = 'myButton'>Start Play by Play</button></div>");


      //Transition to start play by play
      /*$("#nameEntry").fadeOut("slow", function () {
      var div =$(blank);
      $(this).replaceWith(div);
      $("#blank").fadeIn(550);
    });*/

      var div =$(blank);
      transition("#nameEntry",div,"#blank");


    }

  });
  //Begin information getting("night mode")
  $(document).on('click', '#spapButton', function() {

    var currentRole = roleArray[papCounter];
    var roleStatement = "<div id='all' class='wrapper'>"+playerArr[papCounter]+"<br><br><div id='statement' class='wrapper'>";

    shuffleArray(spyArray);
    switch(currentRole) {
      case 'Merlin':
        roleStatement = roleStatement.concat("You are the <span class='resistance'>Merlin</span><br><br>The spies are: <br><br>");
        var tempArray = [];
        for(var i = 0; i < numSpies; i++) {
          tempArray.push(playerArr[roleArray.indexOf('Spy'+i)]);
        }
        if(oberon != null) {
          tempArray.push(playerArr[oberon]);
        }
        if(morgana != null) {
          tempArray.push(playerArr[morgana]);
        }
        shuffleArray(tempArray);
        //loop through and write to roleStatement
        for(var i = 0; i < tempArray.length; i++) {
          roleStatement = roleStatement.concat(tempArray[i] + "   ");
        }
        break;
      case 'Percival':
        if(morgana != null) {
          roleStatement = roleStatement.concat("You are the <span class='resistance'>Percival</span><br> The merlin is: "+  roleArray[merlin]);
        }
        else {
          var seed = getRandomInt(0,1);
          if(seed === 0) {
            roleStatement = roleStatement.concat("You are the <span class='resistance'>Percival</span><br> The merlin is either: "+  roleArray[merlin] + " or " + roleArray[morgana]);
          }
          else {
            roleStatement = roleStatement.concat("You are the <span class='resistance'>Percival</span><br> The merlin is: "+  roleArray[morgana] + " or " + roleArray[merlin]);
          }

        }
        break;
      case 'Mordred':
        roleStatement = roleStatement.concat("You are the <span class='spy'>Mordred</span><br> The spy team is: <br><br>");
        for(var i = 0; i < spyArray.length; i++) {
          var index = spyArray[i];
          roleStatement = roleStatement.concat(playerArr[index] + " ");
        }
        break;
      case 'Morgana':
        roleStatement = roleStatement.concat("You are the <span class='spy'>Morgana</span><br> The spy team is: <br><br>");
        for(var i = 0; i < spyArray.length; i++) {
          var index = spyArray[i];
          roleStatement = roleStatement.concat(playerArr[index] + " ");
        }
        break;
      case 'Oberon':
        roleStatement = roleStatement.concat("You are the <span class='spy'>Oberon</span> <br>You know nothing, Jon Snow.");
        break;
      case 'Spy0':
      case 'Spy1':
      case 'Spy2':
        roleStatement = roleStatement.concat("You are a regular <span class= 'spy'>spy</span>. <br>The spy team is:<br><br>");
        for(var i = 0; i < spyArray.length; i++) {
          var index = spyArray[i];
          roleStatement = roleStatement.concat(playerArr[index] + " ");
        }
        break;
      default:
        roleStatement = roleStatement.concat("You are a <span class = 'resistance'>civilian</span>.");
        break;


    }
    roleStatement = roleStatement.concat("</div><div id='buttonStatment' class = 'wrapper'><button id='toggle' class='myButton'>Show/Hide role</button><br><br>");
    if(papCounter < numPlayers-1) {
      roleStatement = roleStatement.concat("<button id='spapButton' class='myButton'>Move to next player</button></div></div>");
    }
    else {
      roleStatement = roleStatement.concat("<button id='beginGame' class='myButton'>Start Game</button><button id='restartNight' class='myButton'>Restart Night</button></div></div>");
    }
    $('#statement').replaceWith("<div></div>");
    var div =$(roleStatement);
    if(papCounter === 0) {
      /*$("#blank").fadeOut("slow", function () {
      var div =$(roleStatement);
      $(this).replaceWith(div);
      $("#all").fadeIn(550);
    });*/
      captainName = $("#cap option:selected").text();
      captainIndex = $("#cap").val();
      console.log(captainName + ": " + captainIndex);
      transition("#blank",div,"#all");
    } else {
      /*$("#all").fadeOut("slow", function () {
      var div =$(roleStatement);
      $(this).replaceWith(div);
      $("#all").fadeIn(550);
    });*/
      transition("#all",div,"#all");

    }
    papCounter++;
  });
  $(document).on('click','#restartNight',function() {
    papCounter = 0;
    $('#statement').replaceWith("<div></div>");
    var div = $("<div id='blank' class='wrapper'><button id='spapButton' class='myButton'>Restart Night</button><button id='beginGame' class='myButton'>Cancel</button></div>");
    transition("#all",div,"#blank");

  });
  //toggle show/hide of role
  $(document).on('click','#buttonStatment',function() {
    $('#statement').fadeToggle(300);
  });
  //Game Main Menu
  $(document).on('click','#beginGame',function() {
    $('#statement').replaceWith("<div></div>");
    console.log("Round Counter: " + roundCounter);
    gameTemplate = "<div id='game' class='wrapper'>";
    switch(roundCounter) {
      case 1:
        teamCount = 2;
        break;
      case 2:
        teamCount = 3;
        break;
      case 3:
        teamCount = 3;
        break;
      case 4:
        teamCount = 4;
        break;
      case 5:
        teamCount = 4;
        break;
      default:
        console.log("fail");
        break;
    }
    //Determine which mission images to display
    var imgTemplate;
    if(numPlayers === '7') {
      imgTemplate = "<div id='image' class='wrapper'><img src='missions/7m1.png' class='missionPic' id='m1'><img src='missions/7m2.png' class='missionPic' id='m2'><img src='missions/7m3.png' class='missionPic' id='m3'><img src='missions/7m4.png' class='missionPic' id='m4'><img src='missions/7m5.png' class='missionPic' id='m5'> </div>";

    } else {
      imgTemplate = "<div id='image' class='wrapper'><img src='missions/8m1.png' class='missionPic' id='m1'> </div>";
      teamCount++;
    }
    gameTemplate = gameTemplate.concat(imgTemplate);
    gameTemplate = gameTemplate.concat("<div id='dispCap' class='wrapper'>The Captain is: <strong>"+captainName+"</strong></div>");
    //Creates the forms to set up the team
    var teamForm = "<div id ='teamForm' class='wrapper'>";
    for(var formIndex = 0; formIndex < teamCount; formIndex++) {
      console.log("yo");
      teamForm = teamForm.concat("<label for='team"+formIndex+"'>Team Member "+(formIndex+1)+":</label><select id = 'member"+i+"' value='team"+formIndex+"'>");
      for(var i = 0;i<playerArr.length; i++) {
        teamForm = teamForm.concat("<option value = "+ i +"> "+ playerArr[i] +"</option>");
      }
      teamForm = teamForm.concat("</select><br><br>");
    }
    teamForm = teamForm.concat("</div>")

    //Move to voting button
    gameTemplate = gameTemplate.concat(teamForm);
    gameTemplate = gameTemplate.concat("<div id='votingButton' class='wrapper'><button class='myButton' id ='voting'>Move to voting</button></div></div>");
    /*$("#all").fadeOut("slow", function () {
    var div =$(gameTemplate);
    $(this).replaceWith(div);
    $("#game").fadeIn(800);
  });*/
    console.log(teamForm);
    var div =$(gameTemplate);
    transition("#all",div,"#game");

  });
  $(document).on('click','#voting',function() {
    //check to see if team members are dupes
    //if not move on


  });




}

$(document).ready(main);

/*

*/
