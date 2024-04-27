const date = new Date("1997-10-28");
const diffInMilliseconds = Math.abs(new Date() - date);
const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
const diffInWeeks = Math.floor(diffInDays / 7);
const diffInMonths = Math.floor(diffInDays / 30);
const diffInYears = Math.floor(diffInDays / 365);

function setTextOfElement(id, newVal) {
  document.getElementById(id).textContent = newVal;
}

function setDateStats() {
  setTextOfElement("days", diffInDays);
  setTextOfElement("weeks", diffInWeeks);
  setTextOfElement("months", diffInMonths);
  setTextOfElement("years", diffInYears);
}
setDateStats();
