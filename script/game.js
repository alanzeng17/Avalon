//cd Documents/Alan/Personal/Avalon
// for easy github

//To-do list: Add round counter to game screen,merlin guess,implement 8+players

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
//holds each mission's result in each corresponding index
var missionResultArray = ["","","","",""];
//temp used to hold the previous div in the cancel case
var cancelTemp = null;
//temp used to hold the team for each round
var teamTemp = null;
//temp used to count the number of votes
var voteCount = 0;
//temp used to hold the current vote
var voteTemp = "";
//used to hold the votes
var voteArray = null;
var resistanceWins = 0;
var spyWins = 0;
//winner = false when spy wins, equals true win resistance wins
var winner = false;

var globalVoteFlag = false;
var gameOverFlag = false;

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
function isTeamValid(arr) {
  teamTemp = [];
  for(var i = 0; i < teamCount; i++) {
    var mem = $('#member'+i+' option:selected').text();
    teamTemp.push(mem);
  }
  console.log(teamTemp.toString());
  return checkArrayForDupes(teamTemp);
}
function checkSpy(member) {
  for(var i = 0; i < spyArray.length; i++) {
    if(playerArr[spyArray[i]] == member) {
      return true;
    }
  }
  return false;
}
//This fucntion checks to see if a winner has been found, and if so, sets the winner
function checkWinner() {
  if(resistanceWins == 3) {
    winner = true;
    return true;
  } else if(spyWins == 3) {
    return true;
  }
  return false;
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
        if(morgana == null) {
          roleStatement = roleStatement.concat("You are the <span class='resistance'>Percival</span><br> The merlin is: "+  playerArr[merlin]);
        }
        else {
          var seed = getRandomInt(0,1);
          if(seed === 0) {
            roleStatement = roleStatement.concat("You are the <span class='resistance'>Percival</span><br> The merlin is either: "+  playerArr[morgana] + " or " + playerArr[merlin]);
          }
          else {
            roleStatement = roleStatement.concat("You are the <span class='resistance'>Percival</span><br> The merlin is: "+  playerArr[merlin] + " or " + playerArr[morgana]);
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
    temp = div;
    if(papCounter === 0) {
      /*$("#blank").fadeOut("slow", function () {
      var div =$(roleStatement);
      $(this).replaceWith(div);
      $("#all").fadeIn(550);
    });*/
      captainName = $("#cap option:selected").text();
      captainIndex = $("#cap").val();
      console.log("Captain: "+ captainName + ": " + captainIndex);
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
    //completly restart night mode
    papCounter = 0;
    $('#statement').replaceWith("<div></div>");
    var div = $("<div id='blank' class='wrapper'><button id='spapButton' class='myButton'>Restart Night</button><button id='cancelR' class='myButton'>Cancel</button></div>");
    transition("#all",div,"#blank");

  });
  //cancel is clicked
  $(document).on('click','#cancelR',function() {
    //reset vals and div to previous screen
    papCounter = numPlayers-1;
    var div = cancelTemp;
    transition("#blank",div,"#all");

  });
  //toggle show/hide of role
  $(document).on('click','#buttonStatment',function() {
    $('#statement').fadeToggle(300);
  });
  //Game Main Menu
  $(document).on('click','#beginGame',function() {
    //if it is after the 1st round, increment the captain
    if(roundCounter != 1) {
      captainIndex++;
      if(captainIndex == numPlayers) {
        captainIndex = 0;
      }
      captainName = playerArr[captainIndex];
    }

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
    var imgTemplate = "<div id='image' class='wrapper'>";
    if(numPlayers == 7) {
      for(var i = 0; i < 5; i++) {
        switch(missionResultArray[i]) {
          case "Pass":
            imgTemplate = imgTemplate.concat("<img src='missions/7m"+(i+1)+"r.png' class='missionPic' id='m"+(i+1)+"'>");
            break;
          case "Fail":
            imgTemplate = imgTemplate.concat("<img src='missions/7m"+(i+1)+"s.png' class='missionPic' id='m"+(i+1)+"'>");
            break;
          default:
            imgTemplate = imgTemplate.concat("<img src='missions/7m"+(i+1)+".png' class='missionPic' id='m"+(i+1)+"'>");
            break;
        }
      }
    } else {
      for(var i = 0; i < 5; i++) {
        switch(missionResultArray[i]) {
          case "Pass":
            imgTemplate = imgTemplate.concat("<img src='missions/8m"+(i+1)+"r.png' class='missionPic' id='m"+(i+1)+"'>");
            break;
          case "Fail":
            imgTemplate = imgTemplate.concat("<img src='missions/8m"+(i+1)+"s.png' class='missionPic' id='m"+(i+1)+"'>");
            break;
          default:
            imgTemplate = imgTemplate.concat("<img src='missions/8m"+(i+1)+".png' class='missionPic' id='m"+(i+1)+"'>");
            break;
        }

      }
    }
    imgTemplate = imgTemplate.concat("</div>");

    gameTemplate = gameTemplate.concat(imgTemplate);
    gameTemplate = gameTemplate.concat("<div id='dispCap' class='wrapper'>The Captain is: <strong>"+captainName+"</strong></div>");
    //Creates the forms to set up the team
    var teamForm = "<div id ='teamForm' class='wrapper'>";
    for(var formIndex = 0; formIndex < teamCount; formIndex++) {
      teamForm = teamForm.concat("<label for='team"+formIndex+"'>Team Member "+(formIndex+1)+":</label><select id = 'member"+formIndex+"' value='team"+formIndex+"'>");
      for(var i = 0;i<playerArr.length; i++) {
        teamForm = teamForm.concat("<option value = "+ i +">"+ playerArr[i] +"</option>");
      }
      teamForm = teamForm.concat("</select><br><br>");
    }
    teamForm = teamForm.concat("</div>")

    //Move to voting button
    gameTemplate = gameTemplate.concat(teamForm);
    gameTemplate = gameTemplate.concat("<div id='votingButton' class='wrapper'><button class='myButton' id ='voteSet'>Move to voting</button></div></div>");

    var div =$(gameTemplate);

    if(voteFlag) {
      console.log("test");
      transition("#results",div,"#game");
    } else {
      transition("#all",div,"#game");
    }
    roundCounter++;

  });
  $(document).on('click','#voteSet',function() {
    //check to see if team members are dupes
    //if not move on
    if(!isTeamValid()) {
      alert("Please pick a team with unique members!");
    } else {
      voteArray = [];
      var voteSetup = "<div id='voteSetup' class='wrapper'>Pass to <strong>"+teamTemp[0]+"</strong> to begin voting.<br><br><button id='vote' class='myButton'>Begin Voting</button></div>";
      var div = $(voteSetup);
      transition("#game",div,"#voteSetup");
    }


  });
  $(document).on('click','#vote', function() {
    if(voteCount == teamCount) {
      voteTemp = $('#voteSelect option:selected').text();
      if(voteTemp[0] != '-') {
        console.log("Vote array is: " + voteArray.toString());
        voteArray.push(voteTemp);
        var voteReveal = "<div id='results' class='wrapper'>";
        var passCount = 0;
        var failCount = 0;
        var color = "red";
        //reset the vote count
        voteCount = 0;
        var result = "";
        //tally the pass/fail
        for(var i = 0; i < voteArray.length; i++) {
          if(voteArray[i] === 'Pass') {
            passCount++;
          } else {
            failCount++;
          }
        }
        //Determine if mission fails or not
        if(roundCounter === 4) {
          if(failCount >= 2) {
            result = 'Fail';
          } else {
            result = 'Pass';
          }
        } else {
          if(failCount >= 1) {
            result = 'Fail';
          } else {
            result = 'Pass';
          }
        }
        if(result === 'Fail') {
          spyWins++;
          color = "black";
        } else {
          resistanceWins++;
        }
        //set the result in the array, display results
        missionResultArray[roundCounter-2] = result;
        voteReveal = voteReveal.concat("With "+passCount+" votes to pass the mission and "+failCount+" votes to fail the mission, the mission result is:<br><div style='color:"+color+"' class='wrapper'><strong>"+result+"</strong></div><br>");
        var cw = checkWinner();
        if(cw) {
          voteReveal = voteReveal.concat("<button id='endGame' class='myButton'>Continue</button>");
        } else {
          voteReveal = voteReveal.concat("<button id='beginGame' class='myButton'>Continue</button>");
        }
        voteReveal = voteReveal.concat("</div>");
        console.log("Current missions: " + missionResultArray.toString());

        var div = $(voteReveal);
        //enable next round transition
        globalVoteFlag = true;
        transition("#voteForm",div,"#results");
      } else {
        alert("Please choose a vote!!");
      }
    } else {
      var voteFlag = false;
      //If this is first vote, there is no previous vote to get, otherwise, log the previous vote
      if(voteCount != 0) {
        voteTemp = $('#voteSelect option:selected').text();
        if(voteTemp[0] != '-') {
          voteFlag = true;
          voteArray.push(voteTemp);
        }

      } else {
        //set valid since it is first vote
        voteFlag = true;
      }
      //check to see if the vote is valid
      if(voteFlag) {
        var voting = "<div id='voteForm' class='wrapper'><label for ='vote'><strong>"+teamTemp[voteCount]+"</strong><br><br> Choose your vote for the mission.  :</label><select id='voteSelect' value='vote'><option value='x'>--Select Vote--</option><option value='Pass'>Pass</option>";

        //if the voter is a spy, give them the option to fail
        if(checkSpy(teamTemp[voteCount])) {
          voting = voting.concat("<option value='Fail'>Fail</option>");
        }
        voting = voting.concat("</select><br><br><button id ='vote' class='myButton'>Submit</button></div>");

        var div = $(voting);
        if(voteCount == 0) {
          voteCount++;
          transition("#voteSetup",div,"#voteForm");
        } else {
          voteCount++;
          transition("#voteForm",div,"#voteForm");
        }
      } else {
        alert("Please choose a vote!");
      }

    }
  });

  $(document).on('click','#endGame',function() {
    //spies win
    if(!winner) {


    } else {
      //resistance win, proceed to merlin guess

    }

  });





}

$(document).ready(main);

/*

*/
