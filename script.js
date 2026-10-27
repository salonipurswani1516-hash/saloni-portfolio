// All project information is kept here so it is easy to edit.
const projects = [
  { title: "Python Programs Collection", description: "Simple factorial, Fibonacci, and structure-to-dictionary programs.", technologies: ["Python"], github: "https://github.com/salonipurswani1516-hash/python-programs/tree/main/python-programs", live: "projects/python-programs/programs.py" },
  { title: "Messy Python Code Improvement", description: "A small Python program rewritten with functions, clear names, and comments.", technologies: ["Python", "Cursor AI"], github: "https://github.com/salonipurswani1516-hash/python-programs/tree/main/improved-python", live: "projects/improved-python/improved_code.py" },
  { title: "Bug Fixing Using Cursor AI", description: "A corrected marks calculator demonstrating debugging and testing.", technologies: ["Python", "Debugging"], github: "https://github.com/salonipurswani1516-hash/python-programs/tree/main/bug-fixing", live: "projects/bug-fixing/bug_fixed.py" },
  { title: "Interactive Quiz Application", description: "A browser quiz that accepts answers and displays a final score.", technologies: ["HTML", "CSS", "JavaScript"], github: "https://github.com/salonipurswani1516-hash/python-programs/tree/main/quiz-app", live: "projects/quiz-app/index.html" },
  { title: "Book Reading List Application", description: "A browser app for adding books and marking them as read.", technologies: ["HTML", "CSS", "JavaScript"], github: "https://github.com/salonipurswani1516-hash/python-programs/tree/main/reading-list", live: "projects/reading-list/index.html" }
];

const projectList = document.querySelector("#projectList");
const noResults = document.querySelector("#noResults");

function showProjects(searchText = "") {
  const query = searchText.toLowerCase().trim();
  const matchingProjects = projects.filter((project) => {
    const searchableText = `${project.title} ${project.description} ${project.technologies.join(" ")}`.toLowerCase();
    return searchableText.includes(query);
  });

  projectList.innerHTML = matchingProjects.map((project) => `
    <article class="project-card">
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <p class="tags"><strong>Technologies:</strong> ${project.technologies.join(", ")}</p>
      <div class="project-links">
        ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener">GitHub</a>` : ""}
        ${project.live ? `<a href="${project.live}" target="_blank" rel="noopener">Open project</a>` : ""}
      </div>
    </article>
  `).join("");
  noResults.classList.toggle("hidden", matchingProjects.length > 0);
}

showProjects();
document.querySelector("#projectSearch").addEventListener("input", (event) => showProjects(event.target.value));

// Theme toggle. The preference is saved in the browser.
const themeButton = document.querySelector("#themeButton");
if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");
function updateThemeButton() { themeButton.textContent = document.body.classList.contains("dark") ? "☀️ Light mode" : "🌙 Dark mode"; }
updateThemeButton();
themeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  updateThemeButton();
});

// Send a question to the serverless chatbot endpoint.
document.querySelector("#chatForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const input = document.querySelector("#chatInput");
  const messages = document.querySelector("#chatMessages");
  const question = input.value.trim();
  if (!question) return;
  messages.insertAdjacentHTML("beforeend", `<p class="user-message">${question}</p>`);
  input.value = "";
  messages.insertAdjacentHTML("beforeend", `<p id="loadingMessage" class="bot-message">Thinking...</p>`);
  try {
    const response = await fetch("/api/chatbot", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question }) });
    const data = await response.json();
    document.querySelector("#loadingMessage")?.remove();
    messages.insertAdjacentHTML("beforeend", `<p class="bot-message">${data.answer || getDemoAnswer(question)}</p>`);
  } catch (error) {
    document.querySelector("#loadingMessage")?.remove();
    // This temporary offline chatbot works while no API is configured.
    messages.insertAdjacentHTML("beforeend", `<p class="bot-message">${getDemoAnswer(question)}</p>`);
  }
});

// Temporary chatbot answers. Replace this with API answers before final deployment.
function getDemoAnswer(question) {
  const text = question.toLowerCase();
  if (text.includes("skill")) return "The portfolio includes Python, HTML, CSS, JavaScript, GitHub, and Cursor AI.";
  if (text.includes("python")) return "The Python project contains factorial, Fibonacci, and structure-to-dictionary programs.";
  if (text.includes("quiz")) return "The Interactive Quiz Application asks questions and displays the final score.";
  if (text.includes("book") || text.includes("reading")) return "The Book Reading List lets users add books and mark them as read.";
  if (text.includes("bug") || text.includes("correct")) return "The Bug Fixing project demonstrates a corrected marks average calculator.";
  if (text.includes("project")) return "There are five projects: Python Programs, Improved Python Code, Bug Fixing, Interactive Quiz, and Book Reading List.";
  if (text.includes("github")) return "Saloni Purswani's GitHub profile is github.com/salonipurswani1516-hash.";
  return "I can answer questions about the portfolio, skills, GitHub, and projects.";
}
