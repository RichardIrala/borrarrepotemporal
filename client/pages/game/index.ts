import { Router } from "@vaadin/router";
import { state } from "../../state";

class Game extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    const style: HTMLElement = document.createElement("style");
    style.innerHTML = `
      .container {
        margin: 20px auto 0;
        width: 90%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        height: 100vh;
      }
      @media only screen and (min-width: 768px) {
        .container {
          margin: 40px auto 0;
        }
      }

      .leyenda {
        margin-top: 80px;
      }

      .container__hand {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
      }
    `;
    this.shadow.appendChild(style);
  }
  addListeners() {}

  connectedCallback() {
    this.render();
  }
  render() {
    const div: HTMLElement = document.createElement("div");
    const cs = state.getState();
    div.classList.add("container");

    div.innerHTML = `
      <div class="container__hand">
        <hands-comp hand="rock"></hands-comp>
        <hands-comp hand="paper"></hands-comp>
        <hands-comp hand="scissors"></hands-comp>
      </div>
    `;

    this.shadow.appendChild(div);
    this.addListeners();
  }
}
customElements.define("game-page", Game);
