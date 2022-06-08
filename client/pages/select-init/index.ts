import { Router } from "@vaadin/router";
import { state } from "../../state";

class Select extends HTMLElement {
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
      .container__btn {
        display: flex;
        flex-direction: column;
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
    const newGame = this.shadow.querySelector("#newGame");
    newGame.addEventListener("click", e => {
      state.createUser(() => {
        Router.go("/share_id");
      });
    });

    const enterRoom = this.shadow.querySelector("#enterRoom");
    enterRoom.addEventListener("click", e => {
      Router.go("/enter_room");
    });
  }

  connectedCallback() {
    this.render();
  }
  render() {
    const div: HTMLElement = document.createElement("div");
    div.classList.add("container");
    div.innerHTML = `
      <text-custom size="80px" weight="700" color="#009048" lineHeight="1">Piedra Papel o Tijeras</text-custom>
      <div class="container__btn">
        <btn-comp id="newGame">Nuevo Juego</btn-comp>
        <btn-comp id="enterRoom" mt="15px">Ingresar a una sala</btn-comp>
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
customElements.define("select-page", Select);
