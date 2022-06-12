import { Router } from "@vaadin/router";
import { state } from "../../state";

class Waiting extends HTMLElement {
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
  addListeners() {
    state.suscribe(() => {
      const cs = state.getState();
      const player1 = cs.rtdbData.player1;
      const player2 = cs.rtdbData.player2;
      const startPlayer1 = player1.start;
      const startPlayer2 = player2.start;

      if (startPlayer1 && startPlayer2) Router.go("/game");
    });
  }

  connectedCallback() {
    this.render();
  }
  render() {
    const div: HTMLElement = document.createElement("div");
    div.classList.add("container");
    div.innerHTML = `
      <div class="leyenda">
        <text-custom size="40px">Esperando a que el contrincante presione jugar.</text-custom>
      </div>
      
      <div class="container__hand">
        <hands-comp hand="stone"></hands-comp>
        <hands-comp hand="paper"></hands-comp>
        <hands-comp hand="scissors"></hands-comp>
      </div>
    `;
    this.shadow.appendChild(div);
    this.addListeners();
  }
}
customElements.define("waiting-page", Waiting);
