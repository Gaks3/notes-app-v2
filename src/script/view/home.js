import {
  getNotes,
  getArchivedNotes,
  addNote,
  deleteNote,
  archiveNote,
  unarchiveNote,
} from "../api.js";
import { searchNotes } from "./utils.js";
import gsap from "gsap";

export default class HomeView {
  constructor() {
    this.notes = [];
    this.activeTab = "active";
    this.init();
  }

  async init() {
    this.notesGrid = document.getElementById("notes-grid");
    this.noteForm = document.querySelector("note-form");
    this.searchInput = document.getElementById("search-input");
    this.addNoteBtn = document.getElementById("add-note-btn");
    this.noteDialog = document.getElementById("note-dialog");
    this.tabNavigation = document.querySelector("tab-navigation");
    this.deleteDialog = document.querySelector("delete-dialog");

    this.setupEventListeners();
    await this.fetchNotes();
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

    document.addEventListener("delete-note", this.handleDeleteNote.bind(this));
    document.addEventListener(
      "toggle-archive",
      this.handleToggleArchive.bind(this)
    );
    document.addEventListener(
      "confirm-delete",
      this.handleConfirmDelete.bind(this)
    );

    this.tabNavigation.addEventListener(
      "tab-changed",
      this.handleTabChanged.bind(this)
    );
  }

  async fetchNotes() {
    try {
      const loadingSpinner = document.createElement("loading-spinner");
      this.notesGrid.innerHTML = "";
      this.notesGrid.appendChild(loadingSpinner);

      const notes =
        this.activeTab === "active"
          ? await getNotes()
          : await getArchivedNotes();

      this.notes = notes;
      this.filterAndDisplayNotes();
    } catch (error) {
      console.error("Failed to fetch notes:", error);
      this.displayErrorMessage("Failed to load notes. Please try again later.");
    }
  }

  filterAndDisplayNotes(searchTerm = "") {
    const filteredNotes = searchTerm
      ? searchNotes(this.notes, searchTerm)
      : this.notes;

    this.displayNotes(filteredNotes);
  }

  displayNotes(notes) {
    this.notesGrid.innerHTML = "";

    if (notes.length === 0) {
      this.displayNotFoundMessage();
    } else {
      notes.forEach((note) => {
        const noteItem = document.createElement("note-item");
        noteItem.setAttribute("id", note.id);
        noteItem.setAttribute("title", note.title);
        noteItem.setAttribute("body", note.body);
        noteItem.setAttribute("created-at", note.createdAt);
        noteItem.setAttribute("archived", note.archived.toString());

        noteItem.style.opacity = "0";
        noteItem.style.transform = "translateY(20px)";

        this.notesGrid.appendChild(noteItem);
      });

      gsap.to(this.notesGrid.children, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.7)",
        clearProps: "all",
      });
    }
  }

  displayNotFoundMessage() {
    const notFound = document.createElement("div");
    notFound.className = "col-span-full text-center py-8";
    notFound.style.opacity = "0";
    notFound.style.transform = "translateY(20px)";

    notFound.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="text-xl font-semibold text-gray-700 mb-2">No notes found</h3>
      <p class="text-gray-500">
        ${
          this.activeTab === "active"
            ? "Try creating a new note or changing your search term."
            : "You don't have any archived notes yet."
        }
      </p>
    `;

    this.notesGrid.appendChild(notFound);

    gsap.to(notFound, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "back.out(1.7)",
      clearProps: "all",
    });
  }

  displayErrorMessage(message) {
    const loadingSpinner = this.notesGrid.querySelector("loading-spinner");
    if (loadingSpinner) {
      loadingSpinner.remove();
    }

    const errorMessage = document.createElement("div");
    errorMessage.className = "col-span-full text-center py-8";
    errorMessage.style.opacity = "0";
    errorMessage.style.transform = "translateY(20px)";

    errorMessage.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="text-xl font-semibold text-gray-700 mb-2">Error</h3>
      <p class="text-gray-500">${message}</p>
    `;

    this.notesGrid.innerHTML = "";
    this.notesGrid.appendChild(errorMessage);

    gsap.to(errorMessage, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "back.out(1.7)",
      clearProps: "all",
    });
  }

  async handleNoteAdded(event) {
    try {
      const { title, body } = event.detail;
      const response = await addNote(title, body);

      if (response.status === "success") {
        await this.fetchNotes();
      } else {
        throw new Error(response.message || "Failed to add note");
      }
    } catch (error) {
      console.error("Failed to add note:", error);
      this.displayErrorMessage("Failed to add note. Please try again later.");
    }
  }

  handleSearch(event) {
    const searchTerm = event.target.value;
    this.filterAndDisplayNotes(searchTerm);
  }

  handleDeleteNote(event) {
    const { id } = event.detail;
    this.deleteDialog.show(id);
  }

  async handleConfirmDelete(event) {
    const { id } = event.detail;
    try {
      await deleteNote(id);
      await this.fetchNotes();
      this.deleteDialog.close();
    } catch (error) {
      console.error("Failed to delete note:", error);
      this.displayErrorMessage(
        "Failed to delete note. Please try again later."
      );
    } finally {
      this.deleteDialog.setLoading(false);
    }
  }

  async handleToggleArchive(event) {
    const { id, isArchived } = event.detail;

    try {
      if (isArchived) {
        await unarchiveNote(id);
      } else {
        await archiveNote(id);
      }
      await this.fetchNotes();
    } catch (error) {
      console.error("Failed to toggle archive status:", error);
      this.displayErrorMessage(
        `Failed to ${isArchived ? "unarchive" : "archive"} note. Please try again later.`
      );
    }
  }

  handleTabChanged(event) {
    const { tab } = event.detail;
    this.activeTab = tab;
    this.fetchNotes();
  }
}
