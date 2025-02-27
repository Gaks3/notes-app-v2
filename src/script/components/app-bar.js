class AppBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <div class="bg-[#007AFF] text-white p-4 mb-6">
                <h1 class="text-2xl font-bold">Notes App</h1>
            </div>
        `;
  }
}

customElements.define("app-bar", AppBar);
export default AppBar;
