class Search extends HTMLElement {
  #refs = {
    dialog: null,
    form: null,
    input: null,
    suggestions: null,
  };

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const template = document.getElementById("search-template");
    const clone = template.content.cloneNode(true);
    this.#refs.dialog = clone.querySelector(".dialog");
    this.#refs.form = clone.querySelector(".form");
    this.#refs.input = clone.querySelector(".input");
    this.#refs.suggestions = clone.querySelector(".suggestions");
    this.#refs.form.addEventListener("submit", this.#onSubmit, false);
    this.#refs.input.addEventListener("input", this.#onInput);
    this.#refs.suggestions.addEventListener("click", this.#onSuggestionClick);
    document.addEventListener("keydown", this.#onKeydown);
    this.shadowRoot.append(clone);
  }

  static #attachSearchPrefix(array, { key, splitBy }) {
    if (!splitBy) return array;
    return array.map((search) => `${key}${splitBy}${search}`);
  }

  static #escapeRegexCharacters(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  }

  static #fetchDuckDuckGoSuggestions(search) {
    return new Promise((resolve) => {
      window.autocompleteCallback = (res) => {
        const suggestions = [];

        for (const item of res) {
          if (item.phrase === search.toLowerCase()) continue;
          suggestions.push(item.phrase);
        }

        resolve(suggestions);
      };

      const script = document.createElement("script");
      document.querySelector("head").appendChild(script);
      script.src = `https://duckduckgo.com/ac/?callback=autocompleteCallback&q=${search}`;
    });
  }

  static #formatSearchUrl(url, searchPath, search) {
    if (!searchPath) return url;
    const [baseUrl] = Search.#splitUrl(url);
    const urlQuery = encodeURIComponent(search);
    searchPath = searchPath.replace(/{}/g, urlQuery);
    return baseUrl + searchPath;
  }

  static #hasProtocol(s) {
    return /^[a-zA-Z]+:\/\//i.test(s);
  }

  static #isUrl(s) {
    return /^((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)$/i.test(s);
  }

  static #parseQuery = (raw) => {
    const query = raw.trim();

    if (this.#isUrl(query)) {
      const url = this.#hasProtocol(query) ? query : `https://${query}`;
      return { query, url };
    }

    if (COMMANDS[query]) {
      const { key, url } = COMMANDS[query];
      return { key, query, url };
    }

    let splitBy = CONFIG.commandSearchDelimiter;
    const [searchKey, rawSearch] = query.split(new RegExp(`${splitBy}(.*)`));

    if (COMMANDS[searchKey]) {
      const { searchTemplate, url: base } = COMMANDS[searchKey];
      const search = rawSearch.trim();
      const url = Search.#formatSearchUrl(base, searchTemplate, search);
      return { key: searchKey, query, search, splitBy, url };
    }

    splitBy = CONFIG.commandPathDelimiter;
    const [pathKey, path] = query.split(new RegExp(`${splitBy}(.*)`));

    if (COMMANDS[pathKey]) {
      const { url: base } = COMMANDS[pathKey];
      const [baseUrl] = Search.#splitUrl(base);
      const url = `${baseUrl}/${path}`;
      return { key: pathKey, path, query, splitBy, url };
    }

    const [baseUrl, rest] = Search.#splitUrl(CONFIG.defaultSearchTemplate);
    const url = Search.#formatSearchUrl(baseUrl, rest, query);
    return { query, search: query, url };
  };

  static #splitUrl(url) {
    const parser = document.createElement("a");
    parser.href = url;
    const baseUrl = `${parser.protocol}//${parser.hostname}`;
    const rest = `${parser.pathname}${parser.search}`;
    return [baseUrl, rest];
  }

  #close() {
    this.#refs.input.value = "";
    this.#refs.input.blur();
    this.#refs.dialog.close();
    this.#refs.suggestions.innerHTML = "";
  }

  #execute(query) {
    const { url } = Search.#parseQuery(query);
    const target = CONFIG.openLinksInNewTab ? "_blank" : "_self";
    window.open(url, target, "noopener noreferrer");
    this.#close();
  }

  #focusNextSuggestion(previous = false) {
    const active = this.shadowRoot.activeElement;
    let nextIndex;

    if (active.dataset.index) {
      const activeIndex = Number(active.dataset.index);
      nextIndex = previous ? activeIndex - 1 : activeIndex + 1;
    } else {
      nextIndex = previous ? this.#refs.suggestions.childElementCount - 1 : 0;
    }

    const next = this.#refs.suggestions.children[nextIndex];
    if (next) next.querySelector(".suggestion").focus();
    else this.#refs.input.focus();
  }

  #onInput = async () => {
    const q = Search.#parseQuery(this.#refs.input.value);

    if (!q.query) {
      this.#close();
      return;
    }

    let suggestions = COMMANDS[q.query]?.suggestions ?? [];

    if (q.search && suggestions.length < CONFIG.suggestionLimit) {
      const res = await Search.#fetchDuckDuckGoSuggestions(q.search);
      const formatted = Search.#attachSearchPrefix(res, q);
      suggestions = suggestions.concat(formatted);
    }

    this.#renderSuggestions(suggestions, q.query);
  };

  #onKeydown = (e) => {
    if (!this.#refs.dialog.open) {
      this.#refs.dialog.show();
      this.#refs.input.focus();

      requestAnimationFrame(() => {
        // close the search dialog before the next repaint if a character is
        // not produced (e.g. if you type shift, control, alt etc.)
        if (!this.#refs.input.value) this.#close();
      });

      return;
    }

    if (e.key === "Escape") {
      this.#close();
      return;
    }

    const alt = e.altKey ? "alt-" : "";
    const ctrl = e.ctrlKey ? "ctrl-" : "";
    const meta = e.metaKey ? "meta-" : "";
    const shift = e.shiftKey ? "shift-" : "";
    const modifierPrefixedKey = `${alt}${ctrl}${meta}${shift}${e.key}`;

    if (/^(ArrowDown|Tab|ctrl-n)$/.test(modifierPrefixedKey)) {
      e.preventDefault();
      this.#focusNextSuggestion();
      return;
    }

    if (/^(ArrowUp|ctrl-p|shift-Tab)$/.test(modifierPrefixedKey)) {
      e.preventDefault();
      this.#focusNextSuggestion(true);
    }
  };

  #onSubmit = () => {
    this.#execute(this.#refs.input.value);
  };

  #onSuggestionClick = (e) => {
    const ref = e.target.closest(".suggestion");
    if (!ref) return;
    this.#execute(ref.dataset.suggestion);
  };

  #renderSuggestions(suggestions, query) {
    this.#refs.suggestions.innerHTML = "";
    const sliced = suggestions.slice(0, CONFIG.suggestionLimit);
    const template = document.getElementById("suggestion-template");

    for (const [index, suggestion] of sliced.entries()) {
      const clone = template.content.cloneNode(true);
      const ref = clone.querySelector(".suggestion");
      ref.dataset.index = index;
      ref.dataset.suggestion = suggestion;
      const escapedQuery = Search.#escapeRegexCharacters(query);
      const matched = suggestion.match(new RegExp(escapedQuery, "i"));

      if (matched) {
        const template = document.getElementById("match-template");
        const clone = template.content.cloneNode(true);
        const matchRef = clone.querySelector(".match");
        const pre = suggestion.slice(0, matched.index);
        const post = suggestion.slice(matched.index + matched[0].length);
        matchRef.innerText = matched[0];
        matchRef.insertAdjacentHTML("beforebegin", pre);
        matchRef.insertAdjacentHTML("afterend", post);
        ref.append(clone);
      } else {
        ref.innerText = suggestion;
      }

      this.#refs.suggestions.append(clone);
    }
  }
}

customElements.define("search-component", Search);
