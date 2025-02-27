import { formatDate } from "../view/utils.js";
import gsap from "gsap";

class NoteItem extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  static get observedAttributes() {
    return ["title", "body", "created-at", "id", "archived"];
  }

  attributeChangedCallback(_, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
      this.setupEventListeners();
    }
  }

  setupEventListeners() {
    const deleteBtn = this.querySelector(".delete-btn");
    const archiveBtn = this.querySelector(".archive-btn");

    if (deleteBtn) {
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = this.getAttribute("id");
        const event = new CustomEvent("delete-note", {
          detail: { id },
          bubbles: true,
          composed: true,
        });
        this.dispatchEvent(event);
      });
    }

    if (archiveBtn) {
      archiveBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = this.getAttribute("id");
        const isArchived = this.getAttribute("archived") === "true";
        const event = new CustomEvent("toggle-archive", {
          detail: { id, isArchived },
          bubbles: true,
          composed: true,
        });
        this.dispatchEvent(event);
      });
    }
  }

  render() {
    const title = this.getAttribute("title");
    const body = this.getAttribute("body");
    const createdAt = formatDate(this.getAttribute("created-at"));
    const isArchived = this.getAttribute("archived") === "true";

    this.innerHTML = `
      <div class="bg-white rounded-lg p-4 w-full h-full flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-300">
        <div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">${title}</h3>
          <p class="text-gray-600 mb-4">${body}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500 mb-3">Created: ${createdAt}</p>
          <div class="flex justify-between">
            <button class="archive-btn text-sm px-3 py-1 rounded-md ${isArchived ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"} transition-colors duration-300">
              ${isArchived ? "Unarchive" : "Archive"}
            </button>
            <button class="delete-btn text-sm px-3 py-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-300">
              Delete
            </button>
          </div>
        </div>
      </div>
    `;

    const noteCard = this.querySelector("div");
    noteCard.addEventListener("mouseenter", () => {
      gsap.to(noteCard, {
        y: -5,
        duration: 0.2,
        ease: "power2.out",
      });
    });

    noteCard.addEventListener("mouseleave", () => {
      gsap.to(noteCard, {
        y: 0,
        duration: 0.2,
        ease: "power2.in",
      });
    });
  }
}

customElements.define("note-item", NoteItem);
export default NoteItem;
