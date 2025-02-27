class TabNavigation extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.innerHTML = `
        <div class="flex border-b border-gray-200 mb-6">
          <button id="active-tab" class="py-2 px-4 text-[#007AFF] border-b-2 border-[#007AFF] font-medium">
            Active Notes
          </button>
          <button id="archived-tab" class="py-2 px-4 text-gray-500 hover:text-gray-700 font-medium">
            Archived Notes
          </button>
        </div>
      `;
  }

  setupEventListeners() {
    const activeTab = this.querySelector("#active-tab");
    const archivedTab = this.querySelector("#archived-tab");

    activeTab.addEventListener("click", () => {
      this.setActiveTab("active");
      this.dispatchEvent(
        new CustomEvent("tab-changed", {
          detail: { tab: "active" },
          bubbles: true,
        })
      );
    });

    archivedTab.addEventListener("click", () => {
      this.setActiveTab("archived");
      this.dispatchEvent(
        new CustomEvent("tab-changed", {
          detail: { tab: "archived" },
          bubbles: true,
        })
      );
    });
  }

  setActiveTab(tab) {
    const activeTab = this.querySelector("#active-tab");
    const archivedTab = this.querySelector("#archived-tab");

    if (tab === "active") {
      activeTab.classList.add(
        "text-[#007AFF]",
        "border-b-2",
        "border-[#007AFF]"
      );
      activeTab.classList.remove("text-gray-500");

      archivedTab.classList.add("text-gray-500");
      archivedTab.classList.remove(
        "text-[#007AFF]",
        "border-b-2",
        "border-[#007AFF]"
      );
    } else {
      archivedTab.classList.add(
        "text-[#007AFF]",
        "border-b-2",
        "border-[#007AFF]"
      );
      archivedTab.classList.remove("text-gray-500");

      activeTab.classList.add("text-gray-500");
      activeTab.classList.remove(
        "text-[#007AFF]",
        "border-b-2",
        "border-[#007AFF]"
      );
    }
  }
}

customElements.define("tab-navigation", TabNavigation);
export default TabNavigation;
