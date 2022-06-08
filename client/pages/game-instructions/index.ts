import { Router } from "@vaadin/router";
import { state } from "../../state";

class Instructions extends HTMLElement {
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
    const startBtn = this.querySelector("#start");
    console.log(startBtn);

    const cs = state.getState();
    state.suscribe(() => {
      const player2 = cs.rtdbData.player2;
      const startPlayer2 = player2.start;

      console.log("rtdbRoomId desde game instructions", cs.rtdbRoomId);
      console.log("entre al suscribe");
      console.log(startPlayer2);

      if (startPlayer2) {
        Router.go("/waiting");
      }
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
        <text-custom size="40px">Presioná jugar y elegí: piedra, papel o tijera antes de que pasen los 5 segundos.</text-custom>
      </div>

      <btn-comp id="start" mt="15px">Jugar</btn-comp>

      
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
customElements.define("instructions-page", Instructions);
