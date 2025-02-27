export const generateId = () => {
  return `notes-${Date.now()}`;
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

export const searchNotes = (notes, searchTerm) => {
  const term = searchTerm.toLowerCase();
  return notes.filter(
    (note) =>
      note.title.toLowerCase().includes(term) ||
      note.body.toLowerCase().includes(term)
  );
};
