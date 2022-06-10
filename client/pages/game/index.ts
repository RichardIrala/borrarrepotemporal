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
    let counter = 5;
    const countdown = setInterval(() => {
      counter--;
      const counterEl = this.shadow.querySelector(".master-circle");
      counterEl.textContent = String(counter);

      if (counter <= 0) {
        clearInterval(countdown);
      }
    }, 1000);

    const div = document.createElement("div");
    const circleCounter = div.querySelector(".master-circle");
    console.log(circleCounter);

    div.className = "container";
    div.innerHTML = `
    <div class="hands__top">
      <hands-comp hand="rock" class="rock__top hand-display-none"></hands-comp>
      <hands-comp hand="paper" class="paper__top hand-display-none"></hands-comp>
      <hands-comp hand="scissors" class="scissors__top hand-display-none"></hands-comp>
    </div>

    <div class="master-circle">${counter}</div>
    
    
    <div class="container__hand">
      <hands-comp hand="rock" class="rock__bottom disabled"></hands-comp>
      <hands-comp hand="paper" class="paper__bottom disabled"></hands-comp>
      <hands-comp hand="scissors" class="scissors__bottom disabled"></hands-comp>
    </div>
  `;

    const style = document.createElement("style");
    style.innerHTML = `
    .hands__top {
      transform: rotate(180deg);
      display: flex;
      align-items: center;
      position: relative;
      top: -35px;
    }
    .actived {
      display: inherit;
      transform: translateY(-30px);
      transition: all 0.5s;
    }
    .disabled {
      opacity: 60%;
    }
    .hand-display-none {
      display: none;
    }
    .active-hands{
      width
    }
    .actived-hands-top {
      width: 100%;
      display: flex;
      justify-content: center;
    }
    .actived-hand-top {
      display: flex;
      transform: translateY(-30px);
      transition: all 0.5s;
    }
    hands-comp:hover {
      cursor:pointer
    }

    .master-circle {
      width: 150px;
      height: 150px;
      box-shadow: 0 0 0 1.875vmin, inset 3.75vmin 3.75vmin 7.5vmin rgba(0, 0, 0, 0.125), 3.75vmin 3.75vmin 7.5vmin rgba(0, 0, 0, 0.125);
      font-size: 100px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      color: #000;
      border-radius: 50%;
      border: 30px;
      font-weight: 700;
    }

    @media (min-width: 420px) {
      .master-circle {
        width: 250px;
        height: 250px;
        box-shadow: 0 0 0 1.25vmin, inset 2.5vmin 2.5vmin 5vmin rgba(0, 0, 0, 0.125), 2.5vmin 2.5vmin 5vmin rgba(0, 0, 0, 0.125);
        font-size: 25vmin;
        text-shadow: 2.5vmin 2.5vmin 5vmin rgba(0, 0, 0, 0.125);
      }
    }

    .master-circle:before {
      content: "";
      -webkit-animation: 5s 1s forwards timer_countdown, 1s 0.875s 15 timer_beat;
              animation: 5s 1s forwards timer_countdown, 1s 0.875s 15 timer_beat;
      color: #000;
    }
    @-webkit-keyframes timer_beat {
      40%, 80% {
        transform: none;
      }
      50% {
        transform: scale(1.125);
      }
    }
    @keyframes timer_beat {
      40%, 80% {
        transform: none;
      }
      50% {
        transform: scale(1.125);
      }
    }
    .master-circle:after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      z-index: -100;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.125);
      -webkit-animation: 5s 1s linear forwards timer_indicator;
              animation: 5s 1s linear forwards timer_indicator;
    }
    @-webkit-keyframes timer_indicator {
      100% {
        transform: translateY(100%);
      }
    }
    @keyframes timer_indicator {
      100% {
        transform: translateY(100%);
      }
    }
  }
  `;
    const countdownEl = div.querySelector(".master-circle");
    const handsDiv = div.querySelector(".container__hand");

    const handsTop = div.querySelector(".hands__top");
    const handRockTop = div.querySelector(".rock__top");
    const handPaperTop = div.querySelector(".paper__top");
    const handScissorsTop = div.querySelector(".scissors__top");

    const handsBottom = div.querySelector(".container__hand").children;
    const handRockBottom = div.querySelector(".rock__bottom");
    const handScissorsBottom = div.querySelector(".scissors__bottom");
    const handPaperBottom = div.querySelector(".paper__bottom");

    for (const hand of handsBottom) {
      hand.addEventListener("click", () => {
        const type = hand.getAttribute("hand");
        clearInterval(countdown);

        if (type === "scissors") {
          state.changeMove("scissors");
          activeHands("scissors");
        } else if (type === "rock") {
          state.changeMove("rock");
          activeHands("rock");
        } else if (type === "paper") {
          state.changeMove("paper");
          activeHands("paper");
        }
      });
    }

    function activeHands(hand) {
      if (hand === "scissors") {
        handScissorsBottom.classList.remove("disabled");
        handScissorsBottom.classList.add("actived");
        setTimeout(() => {
          handRockBottom.classList.add("hand-display-none");
          handPaperBottom.classList.add("hand-display-none");
        }, 1500);
      } else if (hand === "rock") {
        handRockBottom.classList.remove("disabled");
        handRockBottom.classList.add("actived");
        setTimeout(() => {
          handScissorsBottom.classList.add("hand-display-none");
          handPaperBottom.classList.add("hand-display-none");
        }, 1500);
      } else if (hand === "paper") {
        handPaperBottom.classList.remove("disabled");
        handPaperBottom.classList.add("actived");
        setTimeout(() => {
          handScissorsBottom.classList.add("hand-display-none");
          handRockBottom.classList.add("hand-display-none");
        }, 1500);
      }

      setTimeout(() => {
        // TODO: MOSTRAR LAS MANOS DEL CONTRINCANTE
        // SI EL NOMBRE QUE RECIBO ES DISTINTO AL DEL STATE
        // ESE PLAYER ES EL CONTRINCANTE Y LO MOSTRAREMOS ARRIBA
        const cs = state.getState();
        const actualPlayer = state.checkPlayerFront();
        let opponentMove;
        if (actualPlayer !== cs.name) {
        }
        countdownEl.remove();

        handsDiv.classList.add("active-hands");
        handsTop.classList.add("actived-hands-top");

        if (opponentMove == "scissors") {
          handScissorsTop.classList.add("actived-hand-top");
        }
        if (opponentMove == "rock") {
          handRockTop.classList.add("actived-hand-top");
        }
        if (opponentMove == "paper") {
          handPaperTop.classList.add("actived-hand-top");
        }

        setTimeout(() => {}, 1500);
      }, 1500);
    }

    this.shadow.appendChild(div);
    this.shadow.appendChild(style);
    this.addListeners();
  }
}
customElements.define("game-page", Game);
