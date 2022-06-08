import { Router } from "@vaadin/router";
import { state } from "../../state";

class ShareId extends HTMLElement {
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
    console.log("entre al listener");

    const cs = state.getState();
    state.suscribe(() => {
      const player2 = cs.rtdbData.player2;
      const onlinePlayer2 = player2.online;

      console.log("entre al suscribe");
      console.log(onlinePlayer2);

      if (onlinePlayer2) {
        Router.go("/instructions");
      }
    });
  }

  connectedCallback() {
    const cs = state.getState();
    state.suscribe(() => {
      if (cs.roomId) {
        this.render();
      }
    });
  }
  render() {
    const div: HTMLElement = document.createElement("div");
    div.classList.add("container");
    const cs = state.getState();

    div.innerHTML = `
      <div class="leyenda">
        <text-custom size="40px">Compartí el código:</text-custom>
        <text-custom size="40px" weight="700">${cs.roomId}</text-custom>
        <text-custom size="40px">Con tu contrincante y espera a que ingrese</text-custom>
      </div>
      
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
customElements.define("shareid-page", ShareId);
