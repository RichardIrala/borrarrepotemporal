import { Router } from "@vaadin/router";
import { state } from "../../state";
const resultImages = {
  loss: require("url:../../images/StarLoss.svg"),
  tie: require("url:../../images/StarTie.svg"),
  win: require("url:../../images/StarWins.svg"),
};

class Results extends HTMLElement {
  shadow: ShadowRoot;
  scoreP1;
  scoreP2;
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
  addListeners() {
    const playAgain = this.shadow.querySelector("#playagain");
    playAgain.addEventListener("click", e => Router.go("/instructions"));
    const backHome = this.shadow.querySelector("#backhome");
    backHome.addEventListener("click", e => Router.go("/select"));
  }

  connectedCallback() {
    const cs = state.getState();
    this.scoreP1 = cs.history.player1;
    this.scoreP2 = cs.history.player2;
    this.render();
  }
  render() {
    const div: HTMLElement = document.createElement("div");
    div.classList.add("container");

    const cs = state.getState();
    const actualName = cs.name;
    const player1 = cs.rtdbData.player1.userName;
    const player2 = cs.rtdbData.player2.userName;
    let whoWins = cs.whoWins;

    let image;

    if (whoWins == "player1") {
      if (actualName == player1) {
        image = resultImages.win;
      }
      if (actualName == player2) {
        image = resultImages.loss;
      }
    }
    if (whoWins == "player2") {
      if (actualName == player2) {
        image = resultImages.win;
      }
      if (actualName == player1) {
        image = resultImages.loss;
      }
    }

    div.innerHTML = `
      <div>
        <img class="img__result" src="${image}">
      </div>
      <div class="board">
        <div>
          <h3>Score</h3>
        </div>
        <text-custom size="20px" weight="bold">${player1}: ${this.scoreP1}</text-custom>
        <text-custom size="20px" weight="bold">${player2}: ${this.scoreP2}</text-custom>
      </div>

      <btn-comp id="playagain" class="button">Volver a Jugar</btn-comp>
      <btn-comp id="backhome" class="button back">Volver al Inicio</btn-comp>
    `;
    this.shadow.appendChild(div);
    this.addListeners();
  }
}
customElements.define("results-page", Results);
