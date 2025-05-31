// initialData.js

export async function initialTasks() {
  const API_URL = "https://jsl-kanban-api.vercel.app/";

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(
        `Network response was not ok (Status: ${response.status})`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching initial tasks:", error.message);
    return null;
  }
}

// Initial tasks data for the Kanban board

/*
export const initialTasks = [
  {
    id: 1,
    title: "Launch Epic Career 🚀",
    description: "Create a killer Resume",
    status: "todo",
    board: "Launch Career",
  },

  {
    id: 2,
    title: "Master JavaScript 💛",
    description: "Get comfortable with the fundamentals",
    status: "doing",
    board: "Launch Career",
  },

  {
    id: 3,
    title: "Keep on Going 🏆",
    description: "You're almost there",
    status: "doing",
    board: "Launch Career",
  },

  {
    id: 4,
    title: "Learn Data Structures and Algorithms 📚",
    description:
      "Study fundamental data structures and algorithms to solve coding problems efficiently",
    status: "todo",
    board: "Launch Career",
  },

  {
    id: 12,
    title: "Contribute to Open Source Projects 🌐",
    description:
      "Gain practical experience and collaborate with others in the software development community",
    status: "done",
    board: "Launch Career",
  },

  {
    id: 13,
    title: "Build Portfolio Projects 🛠️",
    description:
      "Create a portfolio showcasing your skills and projects to potential employers",
    status: "done",
    board: "Launch Career",
  },
];
*/
