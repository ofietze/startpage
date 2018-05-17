function daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
}

function startTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById('clock').innerHTML = h + ":" + m + ":" + s;
  var t = setTimeout(function() {
    startTime()
  }, 500);

  var dayOfWeek = today.getDay();
  document.getElementById("wd" + (dayOfWeek + 6) % 7).className = "today";

  // set day of month
  var dayOfMonth = today.getDate();
  document.getElementById('d'+ (dayOfMonth - 1)).className = "today";

  //set Month
  var month = today.getMonth();
  document.getElementById('m' + month).className = "today";
}

function checkTime(i) {
  if (i < 10) {
    i = "0" + i
  }; // add zero in front of numbers < 10
  return i;
}

startTime();
