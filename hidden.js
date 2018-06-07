var totalSeconds = 0;
var t;
var toggle = false;

function show() {
  var timer = document.getElementById('timerDiv').classList.remove("hidden");
}

function toggleTimer(){
  if (toggle) {
    clearInterval(t)
    document.getElementById('search').placeholder ="00:00"
    document.getElementById("startStop").value = "I>"
    toggle = !toggle
  } else {
    startTimer()
    document.getElementById("startStop").value = "II"
    toggle = !toggle
  }
}

function startTimer() {
  var minutes = parseInt(document.getElementById("inputTimeMin").value);
  var seconds = parseInt(document.getElementById("inputTimeSec").value);
  console.log("min: " + minutes);
  console.log("sec: " + seconds);
  totalSeconds = minutes * 60 + seconds;

  formatSeconds(totalSeconds);
  t = setInterval(updateTimer, 1000)

}

function updateTimer(){
  if(totalSeconds <= 0){
    alert("Timer done!");
    clearInterval(t);
    document.getElementById('search').placeholder = "fin"
  }else{
    totalSeconds--;
    formatSeconds(totalSeconds);
  }
}

function formatSeconds(){
  console.log(totalSeconds);
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
