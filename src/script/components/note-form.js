class NoteForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <form id="note-form" class="bg-white rounded px-8 pt-6 pb-8 mb-4 w-full">
        <div class="mb-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Create New Note</h3>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="title">
            Title
          </label>
          <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3 transition-all duration-300" id="title" type="text" placeholder="Note Title" required>
          <p class="text-red-500 text-xs hidden" id="title-error"></p>
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="body">
            Body
          </label>
          <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline field-sizing-content transition-all duration-300" id="body" placeholder="Note Content" rows="8" required></textarea>
          <p class="text-red-500 text-xs hidden" id="body-error"></p>
        </div>
        <div class="flex justify-end gap-3">
        <button type="button" id="cancel-btn" class="px-4 py-2 text-gray-500 font-medium rounded-md transition-colors duration-300 bg-gray-100 hover:bg-gray-200">
          Cancel
        </button>
          <button class="bg-[#007AFF] hover:bg-[#007AFF]/80 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300" type="submit">
            Add Note
          </button>
        </div>
      </form>
    `;

    this.form = this.querySelector("#note-form");
    this.titleInput = this.querySelector("#title");
    this.bodyInput = this.querySelector("#body");
    this.titleError = this.querySelector("#title-error");
    this.bodyError = this.querySelector("#body-error");
    this.cancelBtn = this.querySelector("#cancel-btn");

    this.form.addEventListener("submit", this.handleSubmit.bind(this));
    this.titleInput.addEventListener("input", this.validateTitle.bind(this));
    this.bodyInput.addEventListener("input", this.validateBody.bind(this));
    this.cancelBtn.addEventListener("click", this.handleCancel.bind(this));
  }

  validateTitle() {
    if (this.titleInput.value.length < 3) {
      this.titleError.textContent = "Title must be at least 3 characters long";
      this.titleError.classList.remove("hidden");
      return false;
    } else {
      this.titleError.classList.add("hidden");
      return true;
    }
  }

  validateBody() {
    if (this.bodyInput.value.length < 10) {
      this.bodyError.textContent = "Body must be at least 10 characters long";
      this.bodyError.classList.remove("hidden");
      return false;
    } else {
      this.bodyError.classList.add("hidden");
      return true;
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.validateTitle() && this.validateBody()) {
      const newNote = {
        title: this.titleInput.value,
        body: this.bodyInput.value,
      };
      this.dispatchEvent(new CustomEvent("note-added", { detail: newNote }));
      this.form.reset();
      document.getElementById("note-dialog").close();
    }
  }

  handleCancel() {
    this.form.reset();
    document.getElementById("note-dialog").close();
  }
}

customElements.define("note-form", NoteForm);
export default NoteForm;
