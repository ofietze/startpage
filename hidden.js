var totalSeconds = 0;
var t;
var toggleTime = false;
var toggleS = false;

function toggleShow() {
  if (toggleS) {
  var timer = document.getElementById('timerDiv').classList.add("hidden");
  } else {
    var timer = document.getElementById('timerDiv').classList.remove("hidden");
  }
  toggleS = !toggleS
}

function toggleTimer(){
  if (toggleTime) {
    clearInterval(t)
    document.getElementById('search').placeholder ="00:00"
    document.getElementById("startStop").value = "start"
  } else {
    startTimer()
    document.getElementById("startStop").value = "stop"
  }
    toggleTime = !toggleTime
}

function startTimer() {
  var minutes = parseInt(document.getElementById("inputTimeMin").value);
  var seconds = parseInt(document.getElementById("inputTimeSec").value);

  // check for empty input and set corresponding value to 0
  minutes = minutes !== minutes ? minutes = 0 : minutes = minutes
  seconds = seconds !== seconds ? seconds = 0 : seconds = seconds

  totalSeconds = minutes * 60 + seconds;

  formatSeconds(totalSeconds);
  t = setInterval(updateTimer, 1000)
}

function updateTimer(){
  if(totalSeconds <= 0){
    alert("Timer done!");
    clearInterval(t);
    document.getElementById('search').placeholder = "fin"

  } else{
    totalSeconds--;
    formatSeconds(totalSeconds);
  }
}

function formatSeconds(){
  document.getElementById('search').placeholder =
  checkTime(Math.floor(totalSeconds/60) % 60) +":"
  + checkTime(totalSeconds % 60);
}

function checkTime(i) {
  if (i < 10) {
    i = "0" + i
  }; // add zero in front of numbers < 10
  return i;
}
