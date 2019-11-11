let template = document.getElementById( "star-rating" );

globalThis.customElements.define( template.id, class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild( template.content );
  }
});