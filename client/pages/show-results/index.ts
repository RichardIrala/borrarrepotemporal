import { Router } from "@vaadin/router";
import { state } from "../../state";
const resultImages = {
  loss: require("url:../../images/StarLoss.svg"),
  tie: require("url:../../images/StarTie.svg"),
  win: require("url:../../images/StarWins.svg"),
};

class Results extends HTMLElement {
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
    `;
    this.shadow.appendChild(style);
  }
  addListeners() {}

  connectedCallback() {
    this.render();
  }
  render() {
    const div: HTMLElement = document.createElement("div");
    div.classList.add("container");

    const cs = state.getState();
    let whoWins = state.whoWins();
    let background;
    let imagen;

    if (whoWins === "wins") {
      imagen = resultImages.win;
      background = "rgba(136, 137, 73, 0.6)";
    } else if (whoWins === "loss") {
      imagen = resultImages.loss;
      background = "rgba(137, 73, 73, 0.6)";
    } else {
      imagen = resultImages.tie;
      background = "rgba(106, 112, 101, 0.6)";
    }

    div.innerHTML = `
      <div>
        <img class="img__result" src="${imagen}">
      </div>
      <div class="board">
        <div>
          <h3>Score</h3>
        </div>
          <text-custom>Vos: ${cs.history.player1}</text-custom>
          <text-custom>Máquina: ${cs.history.player2}</text-custom>
      </div>

      <btn-comp class="button">Volver a Jugar</btn-comp>
      <btn-comp class="button back">Volver al Inicio</btn-comp>
    `;
    this.shadow.appendChild(div);
    this.addListeners();
  }
}
customElements.define("results-page", Results);
