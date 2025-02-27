import { formatDate } from "../view/utils.js";

class NoteItem extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ["title", "body", "created-at"];
  }

  attributeChangedCallback(_, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const title = this.getAttribute("title");
    const body = this.getAttribute("body");
    const createdAt = formatDate(this.getAttribute("created-at"));

    this.innerHTML = `
            <div class="bg-white rounded-lg p-4 w-full h-full flex flex-col justify-between">
                <h3 class="text-xl font-bold text-gray-800 mb-2">${title}</h3>
                <p class="text-gray-600 mb-2">${body}</p>
                <p class="text-sm text-gray-500">Created: ${createdAt}</p>
            </div>
        `;
  }
}

customElements.define("note-item", NoteItem);
export default NoteItem;
