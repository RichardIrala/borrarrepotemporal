const hands = {
  rock: require("url:../../images/rock.png"),
  scissors: require("url:../../images/scissors.png"),
  paper: require("url:../../images/paper.png"),
};

customElements.define(
  "hands-comp",
  class extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
    }
    addListeners() {
      this.addEventListener("click", () => {
        const handClick = new CustomEvent("handClick", {
          detail: {
            handMove: this.getAttribute("hand"),
          },
        });
        this.dispatchEvent(handClick);
      });
    }
    render() {
      const shadow = this.attachShadow({ mode: "open" });
      const style = document.createElement("style");
      const div = document.createElement("div");
      const hand = this.getAttribute("hand");

      div.innerHTML = `
        <img class="hand" src="${hands[hand]}" />
      `;

      style.innerHTML = `
        .hand {
          width: 40px;
          margin: 0 10px;
        }
        @media only screen and (min-width: 370px) {
          .hand {
            width: 60px;
          }
        }
        @media only screen and (min-width: 420px) {
          .hand {
            width: 80px;
          }
        }
      `;

      shadow.appendChild(style);
      shadow.appendChild(div);
    }
  }
);
