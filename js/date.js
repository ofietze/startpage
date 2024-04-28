const date = new Date("1997-10-28");
const diffInMilliseconds = Math.abs(new Date() - date);
const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
document.getElementById("days").textContent = diffInDays;
