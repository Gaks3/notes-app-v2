class DeleteDialog extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.innerHTML = `
        <dialog id="delete-dialog" class="p-4 rounded-lg shadow-xl w-full max-w-sm backdrop:bg-black/30 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
          <div class="bg-white rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Delete Note</h3>
            <p class="text-gray-600 mb-6">Are you sure you want to delete this note? This action cannot be undone.</p>
            <div class="flex justify-end gap-3">
              <button id="cancel-delete" class="px-4 py-2 text-gray-500 font-medium rounded-md transition-colors duration-300 bg-gray-100 hover:bg-gray-200">
                Cancel
              </button>
              <button id="confirm-delete" class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 transition-colors duration-300 min-w-[80px]">
                Delete
              </button>
            </div>
          </div>
        </dialog>
      `;

    this.dialog = this.querySelector("#delete-dialog");
    this.confirmBtn = this.querySelector("#confirm-delete");
    this.cancelBtn = this.querySelector("#cancel-delete");
    this.noteToDelete = null;
  }

  setupEventListeners() {
    this.cancelBtn.addEventListener("click", () => {
      if (!this.confirmBtn.disabled) {
        this.dialog.close();
      }
    });

    this.confirmBtn.addEventListener("click", async () => {
      if (this.noteToDelete) {
        // Disable both buttons and show loading state
        this.setLoading(true);

        this.dispatchEvent(
          new CustomEvent("confirm-delete", {
            detail: { id: this.noteToDelete },
            bubbles: true,
          })
        );
      }
    });
  }

  setLoading(isLoading) {
    this.confirmBtn.disabled = isLoading;
    this.cancelBtn.disabled = isLoading;

    if (isLoading) {
      this.confirmBtn.innerHTML = `
          <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        `;
      this.confirmBtn.classList.add("opacity-75");
    } else {
      this.confirmBtn.textContent = "Delete";
      this.confirmBtn.classList.remove("opacity-75");
    }
  }

  show(noteId) {
    this.noteToDelete = noteId;
    this.setLoading(false);
    this.dialog.showModal();
  }

  close() {
    this.dialog.close();
  }
}

customElements.define("delete-dialog", DeleteDialog);
export default DeleteDialog;
