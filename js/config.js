const CONFIG = {
  commandPathDelimiter: "/",
  commandSearchDelimiter: " ",
  defaultSearchTemplate: "https://duckduckgo.com/?q={}",
  openLinksInNewTab: true,
  suggestionLimit: 4,
};

const COMMANDS = {
  0: {
    name: "Local",
    searchTemplate: ":{}",
    suggestions: ["0 8000", "0 8080"],
    url: "http://localhost:3000",
  },
  a: {
    name: "Amazon",
    suggestions: [],
    url: "https://www.amazon.de",
  },
  d: {
    name: "Discord",
    suggestions: [
      "o/channels/803833399684628520",
      "o/channels/830183651022471199",
    ],
    url: "https://discord.com/channels/@me",
  },
  f: {
    name: "Figma",
    url: "https://www.figma.com/files/recent",
  },
  g: {
    name: "GitHub",
    searchTemplate: "/search?q={}",
    suggestions: ["g/trending", "g/ofietze", "gist.github.com"],
    url: "https://github.com",
  },
  h: {
    name: "Hypem",
    searchTemplate: "/search/{}",
    suggestions: ["h/popular", "h/popular/lastweek", "h/tags"],
    url: "https://hypem.com/latest",
  },
  l: {
    name: "Lichess",
    searchTemplate: "/analysis",
    url: "https://www.lichess.org",
  },
  n: {
    name: "Notion",
    url: "https://www.notion.so",
  },
  r: {
    name: "Reddit",
    searchTemplate: "/search?q={}",
    suggestions: [
      "r/r/startpages",
      "r/r/anarchychess",
      "r/r/formuladank",
      "r/r/aita",
    ],
    url: "https://www.reddit.com",
  },
  s: {
    name: "Spotify",
    searchTemplate: "/search/{}",
    suggestions: ["s/collection/tracks", "s/playlist/37i9dQZEVXcXr3r4FYT3J7"],
    url: "https://open.spotify.com",
  },
  t: {
    name: "Twitter",
    searchTemplate: "/search?q={}",
    url: "https://twitter.com/home",
  },
  y: {
    name: "YouTube",
    searchTemplate: "/results?search_query={}",
    suggestions: ["y/feed/trending", "y/feed/subscriptions"],
    url: "https://youtube.com/",
  },
};
