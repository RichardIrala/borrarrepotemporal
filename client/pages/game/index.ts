import { Router } from "@vaadin/router";
import { state } from "../../state";

class Game extends HTMLElement {
  shadow: ShadowRoot;
  counter: number = 5;

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
    const countdown = setInterval(() => {
      this.counter--;
      const counterEl = this.shadow.querySelector(".master-circle");
      counterEl.textContent = String(this.counter);

      if (this.counter <= 0) {
        clearInterval(countdown);
      }
    }, 1000);

    const countdownEl = this.shadow.querySelector(".master-circle");
    const handsDiv = this.shadow.querySelector(".container__hand");

    const handsTop = this.shadow.querySelector(".hands__top");
    const handstoneTop = this.shadow.querySelector(".stone__top");
    const handPaperTop = this.shadow.querySelector(".paper__top");
    const handScissorsTop = this.shadow.querySelector(".scissors__top");

    const handsBottom = this.shadow.querySelector(".container__hand").children;
    const handstoneBottom = this.shadow.querySelector(".stone__bottom");
    const handScissorsBottom = this.shadow.querySelector(".scissors__bottom");
    const handPaperBottom = this.shadow.querySelector(".paper__bottom");

    for (const hand of handsBottom) {
      hand.addEventListener("click", () => {
        const type = hand.getAttribute("hand");

        if (type === "scissors") {
          state.changeMove("scissors");
          activeHands("scissors");
        } else if (type === "stone") {
          state.changeMove("stone");
          activeHands("stone");
        } else if (type === "paper") {
          state.changeMove("paper");
          activeHands("paper");
        }
        setTimeout(() => {
          clearInterval(countdown);
        }, 5000);
      });

      function activeHands(hand) {
        if (hand === "scissors") {
          handScissorsBottom.classList.remove("disabled");
          handScissorsBottom.classList.add("actived");
          handstoneBottom.classList.add("hand-display-none");
          handPaperBottom.classList.add("hand-display-none");
        } else if (hand === "stone") {
          handstoneBottom.classList.remove("disabled");
          handstoneBottom.classList.add("actived");
          handScissorsBottom.classList.add("hand-display-none");
          handPaperBottom.classList.add("hand-display-none");
        } else if (hand === "paper") {
          handPaperBottom.classList.remove("disabled");
          handPaperBottom.classList.add("actived");
          handScissorsBottom.classList.add("hand-display-none");
          handstoneBottom.classList.add("hand-display-none");
        }
        setTimeout(() => {
          countdownEl.remove();
        }, 5000);
      }
      setTimeout(() => {
        const cs = state.getState();
        const actualName = cs.name;
        const namePlayer1 = cs.rtdbData.player1.userName;
        const movePlayer1 = cs.rtdbData.player1.moveChoise;
        const namePlayer2 = cs.rtdbData.player2.userName;
        const movePlayer2 = cs.rtdbData.player2.moveChoise;

        let opponent;
        if (actualName === namePlayer1) opponent = movePlayer2;
        if (actualName === namePlayer2) opponent = movePlayer1;
        handsDiv.classList.add("active-hands");
        handsTop.classList.add("actived-hands-top");

        if (opponent == "scissors") {
          handScissorsTop.classList.add("actived-hand-top");
        }
        if (opponent == "stone") {
          handstoneTop.classList.add("actived-hand-top");
        }
        if (opponent == "paper") {
          handPaperTop.classList.add("actived-hand-top");
        }
      }, 6000);

      setTimeout(() => {
        console.log("se ejecuta mas de una vez?");
        Router.go("/results");
      }, 9000);

      // const cs = state.getState();
      // state.suscribe(() => {
      //   const actualName = cs.name;
      //   const namePlayer1 = cs.rtdbData.player1.userName;
      //   const movePlayer1 = cs.rtdbData.player1.moveChoise;
      //   const namePlayer2 = cs.rtdbData.player2.userName;
      //   const movePlayer2 = cs.rtdbData.player2.moveChoise;
      // let opponent;

      //   setTimeout(() => {
      //     if (actualName === namePlayer1) opponent = movePlayer2;
      //     if (actualName === namePlayer2) opponent = movePlayer1;

      // handsDiv.classList.add("active-hands");
      // handsTop.classList.add("actived-hands-top");

      // if (opponent == "scissors") {
      //   handScissorsTop.classList.add("actived-hand-top");
      // }
      // if (opponent == "stone") {
      //   handstoneTop.classList.add("actived-hand-top");
      // }
      // if (opponent == "paper") {
      //   handPaperTop.classList.add("actived-hand-top");
      // }
      //   }, 5000);
      // });
    }
  }

  connectedCallback() {
    this.render();
  }
  render() {
    const div = document.createElement("div");

    div.className = "container";
    div.innerHTML = `
    <div class="hands__top">
      <hands-comp hand="stone" class="stone__top hand-display-none"></hands-comp>
      <hands-comp hand="paper" class="paper__top hand-display-none"></hands-comp>
      <hands-comp hand="scissors" class="scissors__top hand-display-none"></hands-comp>
    </div>

    <div class="master-circle">${this.counter}</div>
    
    <div class="container__hand">
      <hands-comp hand="stone" class="stone__bottom disabled"></hands-comp>
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

    this.shadow.appendChild(div);
    this.shadow.appendChild(style);
    this.addListeners();
  }
}
customElements.define("game-page", Game);
