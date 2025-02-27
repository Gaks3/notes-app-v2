const BASE_URL = "https://notes-api.dicoding.dev/v2";

export const getNotes = async () => {
  const response = await fetch(`${BASE_URL}/notes`);
  const data = await response.json();

  return data.data;
};

export const addNote = async (title, body) => {
  const response = await fetch(`${BASE_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, body }),
  });

  return response.json();
};

export const deleteNote = async (id) => {
  await fetch(`${BASE_URL}/notes/${id}`, { method: "DELETE" });
};
