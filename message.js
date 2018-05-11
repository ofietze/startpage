var r_text = new Array ();
r_text[0] = "Was guckst du?!";
r_text[1] = "42";
r_text[2] = "Hallo, du Lappen!";
r_text[3] = "Du siehst heute aber bescheiden aus.";
r_text[4] = "Auf an die Arbeit!";

var i = Math.floor(r_text.length * Math.random());
document.getElementById('message').innerHTML = r_text[i];
