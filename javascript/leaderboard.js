function Score (name, score) {
  this.name = name;
  this.score = score;
}

function namePer() {
  var name = localStorage.name;
  var userName = document.getElementById('useName');
  userName.textContent = name ;
}
namePer();

localStorage.score = 6;
localStorage.leaderboard = JSON.stringify([new Score ('red', 10), new Score ('orange', 9), new Score ('yellow', 8), new Score ('green', 7), new Score ('blue', 6), new Score ('indigo', 5), new Score ('violet', 4)]);
//var arr = JSON.parse(localStorage.get (leaderb));
var scoringMethods = {
  add: function() {
    var arr = JSON.parse (localStorage.leaderboard);
    var newArr = [];
    var added = false;
    for (var i in arr){
      if (arr[i].score < localStorage.score && added === false){
        newArr.push(new Score (localStorage.name, localStorage.score));
        added = true;
      }
      newArr.push(arr[i]);
    }
    newArr.pop();
    localStorage.leaderboard = JSON.stringify (newArr);
  },

  display: function() {
    var lb = JSON.parse (localStorage.leaderboard);
    console.log(lb);
    console.log(lb[0].name);
    var parent = document.getElementById('main-table');
    var child = document.createElement('thead');
    parent.appendChild (child);
    parent = child;
    child = this.buildRow(['rank','name','score']);
    parent.appendChild(child);
    parent = document.getElementById('main-table');
    child = document.createElement('tbody');
    parent.appendChild(child);
    parent = child;
    for (var i in lb){
      var rank = parseInt(i) + 1;
      console.log(rank);
      parent.appendChild(this.buildRow([rank, lb[i].name, lb[i].score]));
    }
  },

  buildRow: function(dataArray) {
    var row = document.createElement('tr');
    for (var j in dataArray){
      var data = document.createElement('td');
      data.textContent = dataArray[j];
      row.appendChild(data);
    }
    return row;
  },
};

scoringMethods.display();
