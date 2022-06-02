customElements.define(
  "text-custom",
  class extends HTMLElement {
    shadow: ShadowRoot;

    constructor() {
      super();
      this.render();
    }
    render() {
      this.shadow = this.attachShadow({ mode: "open" });
      const style = document.createElement("style");
      const divEl = document.createElement("div");
      const size = this.getAttribute("size") || "18px";
      const weight = this.getAttribute("weight") || "400";
      const color = this.getAttribute("color") || "#000";
      const lineHeight = this.getAttribute("lineHeight") || "#000";
      const textAlign = this.getAttribute("textAlign") || "center";
      divEl.classList.add("text");

      divEl.innerHTML = this.textContent;
      style.innerHTML = `
      .text {
        font-size: ${size};
        font-weight: ${weight};
        color: ${color};
        line-height: ${lineHeight};
        text-align: ${textAlign};
      }
      `;

      this.shadow.appendChild(divEl);
      this.shadow.appendChild(style);
    }
  }
);
