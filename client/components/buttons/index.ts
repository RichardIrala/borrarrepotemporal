customElements.define(
  "btn-comp",
  class extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
      super();
      this.render();
    }
    render() {
      const shadow = this.attachShadow({ mode: "open" });
      const style = document.createElement("style");
      const btnEl = document.createElement("button");
      const mt = this.getAttribute("mt") || "10px";

      btnEl.textContent = this.textContent;
      btnEl.className = "btn";

      style.innerHTML = `
        .btn{
          width: 310px;
          min-height: 87px;
          height: max-content;
          background-color: #006CFC;
          color: #ffff;
          font-size: 40px;
          font-family: "Patrick Hand", sans-serif;
          border: 10px solid #001997;
          border-radius: 10px;
          margin: ${mt} auto;
        }

        .btn:hover {
          cursor: pointer;
        }
      `;

      shadow.appendChild(style);
      shadow.appendChild(btnEl);
    }
  }
);
