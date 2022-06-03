customElements.define(
  "input-comp",
  class InputComp extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      this.render();
    }
    render() {
      const input = document.createElement("input");
      const style = document.createElement("style");
      input.className = "input-el";
      input.placeholder = this.textContent;

      style.innerText = `
        .input-el {
          width: 296px;
          height: 66px;
          text-align: center;
          border: 10px solid #182460;
          border-radius: 10px; 
          font-size: 45px;
        }
        `;

      input.textContent = this.textContent;
      this.shadow.appendChild(input);
      this.shadow.appendChild(style);
    }
  }
);
