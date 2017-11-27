function Score (name, score) {
  this.name = name;
  this.score = score;
};

var arr = [new Score ('red', 10), new Score ('orange', 9), new Score ('yellow', 8), new Score ('green', 7), new Score ('blue', 6), new Score ('indigo', 5), new Score ('violet', 4)];
//var arr = JSON.parse(localStorage.get (leaderb));
var scoringMethods = {
  function add (): {
    //TODO get from local
    var newArr = []
    for (i in arr){
      if (arr[i].score < num){
        newArr.push(new Score (localStorage.name, localStorage.score));
      }
      newArr.push(arr[i]);
    }
    newArr.pop();
    //TODO add to localStorage
  }
}
