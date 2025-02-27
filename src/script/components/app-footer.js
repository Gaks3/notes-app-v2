class AppFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
              <div class="bg-[#007AFF]/5 py-4">
                  <div class="container mx-auto text-center">
                      <p>&copy; 2024 Notes App. All rights reserved.</p>
                      <p class="mt-2 text-sm text-gray-400">Made with ❤️ by Gaks3</p>
                  </div>
              </div>
          `;
  }
}

customElements.define("app-footer", AppFooter);
export default AppFooter;
