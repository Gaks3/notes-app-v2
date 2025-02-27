import notesData from "../data/local/notes.js";
import { searchNotes } from "./utils.js";

export default class HomeView {
  constructor() {
    this.notesData = notesData;
    this.init();
  }

  init() {
    this.notesGrid = document.getElementById("notes-grid");
    this.noteForm = document.querySelector("note-form");
    this.searchInput = document.getElementById("search-input");
    this.addNoteBtn = document.getElementById("add-note-btn");
    this.noteDialog = document.getElementById("note-dialog");

    this.setupEventListeners();
    this.displayNotes(this.notesData);
  }

  setupEventListeners() {
    this.noteForm.addEventListener(
      "note-added",
      this.handleNoteAdded.bind(this)
    );
    this.searchInput.addEventListener("input", this.handleSearch.bind(this));
    this.addNoteBtn.addEventListener("click", () =>
      this.noteDialog.showModal()
    );
  }

  displayNotes(notes) {
    this.notesGrid.innerHTML = "";

    if (notes.length === 0) {
      this.displayNotFoundMessage();
    } else {
      notes.forEach((note) => {
        const noteItem = document.createElement("note-item");
        noteItem.setAttribute("title", note.title);
        noteItem.setAttribute("body", note.body);
        noteItem.setAttribute("created-at", note.createdAt);
        this.notesGrid.prepend(noteItem);
      });
    }
  }

  displayNotFoundMessage() {
    const notFound = `
            <div class="col-span-full text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 class="text-xl font-semibold text-gray-700 mb-2">No notes found</h3>
            </div>
    `;

    this.notesGrid.innerHTML = notFound;
  }

  handleNoteAdded(event) {
    const newNote = event.detail;
    this.notesData.unshift(newNote);
    this.displayNotes(this.notesData);
  }

  handleSearch(event) {
    const searchTerm = event.target.value;
    const filteredNotes = searchNotes(this.notesData, searchTerm);
    this.displayNotes(filteredNotes);
  }
}
