class Commands extends HTMLElement {
  #refs = {
    commands: null,
  };

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const template = document.getElementById("commands-template");
    const clone = template.content.cloneNode(true);
    this.#refs.commands = clone.querySelector(".commands");
    this.#renderCommands();
    this.shadowRoot.append(clone);
  }

  #renderCommands() {
    const template = document.getElementById("command-template");

    for (const [key, { name, url }] of Object.entries(COMMANDS)) {
      if (!name || !url) continue;
      const clone = template.content.cloneNode(true);
      const command = clone.querySelector(".command");
      command.href = url;
      if (CONFIG.openLinksInNewTab) command.target = "_blank";
      clone.querySelector(".key").innerText = key;
      clone.querySelector(".name").innerText = name;
      this.#refs.commands.append(clone);
    }
  }
}

customElements.define("commands-component", Commands);
