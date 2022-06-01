class Home extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  addListeners() {}

  connectedCallback() {
    this.render();
  }
  render() {
    this.shadow.innerHTML = `
      <h1>prueba dos</h1>
    `;
  }
}
customElements.define("home-page", Home);
