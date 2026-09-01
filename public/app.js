const app = document.getElementById("app");

let adminToken = localStorage.getItem("adminToken");
let isAdmin = !!adminToken;

let resources = [];
let announcements = [];
let projects = [];
let calendarEvents = [];

/* =========================================================
   HELPERS
   ========================================================= */

const esc = value =>
  String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));

/* =========================================================
   API
   ========================================================= */

async function api(url, options = {}) {

  const headers = {
    ...(options.headers || {})
  };

  if (adminToken) {
    headers.Authorization = "Bearer " + adminToken;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {

    if (response.status === 401) {
      adminToken = null;
      isAdmin = false;
      localStorage.removeItem("adminToken");
      updateNavigation();
    }

    throw new Error(
      data.message || "Request failed."
    );
  }

  return data;
}

/* =========================================================
   NAVIGATION
   ========================================================= */

function toggleNav() {
  document.getElementById("nav")?.classList.toggle("open");
}

function updateNavigation() {

  const items = [
    ["adminBtn", !isAdmin],
    ["loginBtn", isAdmin],
    ["logoutBtn", !isAdmin]
  ];

  items.forEach(([id, hide]) => {
    document
      .getElementById(id)
      ?.classList.toggle("hidden", hide);
  });
}

function showPage(page) {

  document
    .getElementById("nav")
    ?.classList.remove("open");

  const pages = {

    home: renderHome,
    library: renderLibrary,
    results: renderResults,
    placements: renderPlacements,
    coding: renderCoding,
    aptitude: renderAptitude,
    internships: renderInternships,
    resume: renderResume,
    announcements: renderAnnouncements,
    calendar: renderCalendar,
    projects: renderProjects,
    links: renderLinks,

    communication: renderCommunication,
    technical: renderTechnical,
    interview: renderInterview,
    roadmap: renderRoadmap,
    daily: renderDaily,

    login: renderLogin,
    admin: renderAdmin
  };

  (pages[page] || renderHome)();
}

const homeButton = () => `
  <button
    class="secondary"
    onclick="showPage('home')"
  >
    🏠 Back to Home
  </button>
`;

/* =========================================================
   HOME
   ========================================================= */

function renderHome() {

  const cards = [

    ["📚 E-Library",
      "Study materials and engineering resources.",
      "library"],

    ["🎓 Results",
      "Semester results and CGPA.",
      "results"],

    ["💼 Placements",
      "Placement preparation and resources.",
      "placements"],

    ["💻 Coding Practice",
      "Programming, DSA and SQL practice.",
      "coding"],

    ["🎯 Aptitude",
      "Aptitude and reasoning practice.",
      "aptitude"],

    ["🏢 Internships",
      "Find internship opportunities.",
      "internships"],

    ["📝 Resume Builder",
      "Create a simple resume.",
      "resume"],

    ["🚀 Project Ideas",
      "Engineering project ideas.",
      "projects"],

    ["📅 Academic Calendar",
      "Exams, holidays and events.",
      "calendar"],

    ["🗣️ Communication & English",
      "Improve English speaking and communication.",
      "communication"],

    ["🛠️ Technical Skills",
      "Learn important engineering technical subjects.",
      "technical"],

    ["🎤 Interview Preparation",
      "Prepare for HR and technical interviews.",
      "interview"],

    ["🚀 Job Preparation Roadmap",
      "Step-by-step roadmap to get a job.",
      "roadmap"],

    ["📅 Daily Practice",
      "Daily English, coding, aptitude and technical practice.",
      "daily"]

  ];

  app.innerHTML = `

    <section class="hero">

      <h1>
        🎓 Engineering Student Portal
      </h1>

      <p class="created-by">
        Created by Adarsh Anand Patil
      </p>

      <p>
        Study, placements, coding, communication,
        interviews and career preparation in one place.
      </p>

    </section>

    <div class="grid">

      ${cards.map(card => `

        <div class="card">

          <h2>${card[0]}</h2>

          <p>${card[1]}</p>

          <button
            onclick="showPage('${card[2]}')"
          >
            Open
          </button>

        </div>

      `).join("")}

    </div>

    <div class="notice">

      <b>Public access:</b>

      Students can view the portal.
      Only the Creator/Admin can manage content.

    </div>

  `;
}

/* =========================================================
   RESULTS
   ========================================================= */

let semesterResults =
  JSON.parse(
    localStorage.getItem("semesterResults") || "[]"
  );

function renderResults() {

  app.innerHTML = `

    <div class="card">

      <h2>
        🎓 VTU Results & Academic Performance
      </h2>

      ${homeButton()}

      <p>
        Check your official VTU result and maintain
        your semester-wise subject results.
      </p>

      <div class="notice">

        <h3>Official VTU Results</h3>

        <p>
          Open the official VTU result portal and
          enter your USN to view your marks, grades,
          grade points and credits.
        </p>

        <a
          class="btn"
          href="https://results.vtu.ac.in/"
          target="_blank"
          rel="noopener noreferrer"
        >
          🔗 Open VTU Results Portal
        </a>

      </div>

    </div>

    <div class="card">

      <h2>📚 Semester-wise Subject Results</h2>

      <div class="formgrid">

        <div>

          <label>Semester</label>

          <select id="resultSemester">

            <option value="1">1st Semester</option>
            <option value="2">2nd Semester</option>
            <option value="3">3rd Semester</option>
            <option value="4">4th Semester</option>
            <option value="5">5th Semester</option>
            <option value="6">6th Semester</option>
            <option value="7">7th Semester</option>
            <option value="8">8th Semester</option>

          </select>

        </div>

        <div>

          <label>Subject</label>

          <input
            id="resultSubject"
            placeholder="Example: Mathematics"
          >

        </div>

        <div>

          <label>Grade</label>

          <input
            id="resultGrade"
            placeholder="Example: A"
          >

        </div>

        <div>

          <label>Grade Point</label>

          <input
            id="resultGradePoint"
            type="number"
            min="0"
            max="10"
            step="0.01"
          >

        </div>

        <div>

          <label>Credits</label>

          <input
            id="resultCredits"
            type="number"
            min="0"
            max="10"
            step="0.5"
          >

        </div>

      </div>

      <button onclick="addSemesterResult()">
        ➕ Add Subject Result
      </button>

    </div>

    <div class="card">

      <h2>📊 All Semester Results</h2>

      <div class="table-wrap">

        <table>

          <thead>

            <tr>
              <th>Semester</th>
              <th>Subject</th>
              <th>Grade</th>
              <th>Grade Point</th>
              <th>Credits</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody id="semesterResultTable"></tbody>

        </table>

      </div>

    </div>

    <div class="card">

      <h2>📈 Overall CGPA</h2>

      <p>
        Enter your semester SGPA values.
      </p>

      <div class="formgrid">

        ${Array.from(
          { length: 8 },
          (_, i) => `

            <div>

              <label>
                Semester ${i + 1} SGPA
              </label>

              <input
                class="semester-sgpa"
                type="number"
                min="0"
                max="10"
                step="0.01"
                placeholder="0.00"
              >

            </div>

          `
        ).join("")}

      </div>

      <button onclick="calculateOverallCGPA()">
        Calculate Overall CGPA
      </button>

      <div id="overallCGPA"></div>

    </div>

  `;

  loadSemesterResults();
}

function addSemesterResult() {

  const semester =
    document.getElementById("resultSemester").value;

  const subject =
    document.getElementById("resultSubject").value.trim();

  const grade =
    document.getElementById("resultGrade").value.trim();

  const gradePoint =
    document.getElementById("resultGradePoint").value;

  const credits =
    document.getElementById("resultCredits").value;

  if (
    !subject ||
    !grade ||
    gradePoint === "" ||
    credits === ""
  ) {
    return alert(
      "Please enter all subject result details."
    );
  }

  semesterResults.push({

    id: Date.now(),

    semester: Number(semester),

    subject,

    grade,

    gradePoint: Number(gradePoint),

    credits: Number(credits)

  });

  localStorage.setItem(
    "semesterResults",
    JSON.stringify(semesterResults)
  );

  document.getElementById("resultSubject").value = "";
  document.getElementById("resultGrade").value = "";
  document.getElementById("resultGradePoint").value = "";
  document.getElementById("resultCredits").value = "";

  loadSemesterResults();
}

function loadSemesterResults() {

  const table =
    document.getElementById(
      "semesterResultTable"
    );

  if (!table) return;

  if (!semesterResults.length) {

    table.innerHTML = `
      <tr>
        <td colspan="6">
          No semester results added yet.
        </td>
      </tr>
    `;

    return;
  }

  const sorted =
    [...semesterResults].sort(
      (a, b) => a.semester - b.semester
    );

  table.innerHTML =
    sorted.map(item => `

      <tr>

        <td>
          Semester ${item.semester}
        </td>

        <td>
          ${esc(item.subject)}
        </td>

        <td>
          ${esc(item.grade)}
        </td>

        <td>
          ${Number(item.gradePoint).toFixed(2)}
        </td>

        <td>
          ${Number(item.credits).toFixed(2)}
        </td>

        <td>

          <button
            class="danger"
            onclick="deleteSemesterResult(${item.id})"
          >
            Delete
          </button>

        </td>

      </tr>

    `).join("");
}

function deleteSemesterResult(id) {

  if (!confirm("Delete this subject result?"))
    return;

  semesterResults =
    semesterResults.filter(
      item => item.id !== id
    );

  localStorage.setItem(
    "semesterResults",
    JSON.stringify(semesterResults)
  );

  loadSemesterResults();
}

function calculateOverallCGPA() {

  const values =
    [...document.querySelectorAll(
      ".semester-sgpa"
    )]
      .map(input => Number(input.value))
      .filter(value => value > 0);

  if (!values.length) {

    return alert(
      "Enter at least one semester SGPA."
    );

  }

  const cgpa =
    values.reduce(
      (sum, value) => sum + value,
      0
    ) / values.length;

  document.getElementById(
    "overallCGPA"
  ).innerHTML = `

    <div class="notice">

      <h2>
        Overall CGPA: ${cgpa.toFixed(2)}
      </h2>

      <p>
        Based on ${values.length} semester(s).
      </p>

    </div>

  `;
}

/* =========================================================
   E-LIBRARY
   ========================================================= */

async function renderLibrary() {

  try {

    resources =
      await api("/api/resources");

    app.innerHTML = `

      <div class="card">

        <h2>
          📚 E-Library & Engineering Resources
        </h2>

        ${homeButton()}

        <div class="formgrid">

          <div>

            <label>Search</label>

            <input
              id="rs"
              oninput="filterR()"
              placeholder="Search resources..."
            >

          </div>

          <div>

            <label>Category</label>

            <select
              id="rt"
              onchange="filterR()"
            >

              <option value="">
                All Categories
              </option>

              <option>Coding</option>
              <option>Learning</option>
              <option>Aptitude</option>
              <option>Technical</option>
              <option>Interview</option>
              <option>Placement</option>

            </select>

          </div>

        </div>

      </div>

      <div id="rl"></div>

      ${
        isAdmin
          ? `

            <div class="card">

              <h2>
                🔐 Admin: Add Resource
              </h2>

              <form id="rf">

                <div class="formgrid">

                  <div>
                    <label>Category</label>
                    <input name="type" required>
                  </div>

                  <div>
                    <label>Title</label>
                    <input name="title" required>
                  </div>

                  <div>
                    <label>URL</label>
                    <input
                      name="url"
                      type="url"
                      required
                    >
                  </div>

                </div>

                <label>Description</label>

                <textarea
                  name="description"
                ></textarea>

                <button>
                  Add Resource
                </button>

              </form>

            </div>
          `
          : ""
      }

    `;

    drawR(resources);

    document
      .getElementById("rf")
      ?.addEventListener(
        "submit",
        addR
      );

  } catch (error) {

    app.innerHTML = `
      <div class="card">
        <h2>Unable to load resources</h2>
        <p>${esc(error.message)}</p>
      </div>
    `;
  }
}

function drawR(list) {

  const container =
    document.getElementById("rl");

  if (!container) return;

  container.innerHTML =
    list.map(item => `

      <div class="card">

        <h3>${esc(item.title)}</h3>

        <span class="badge green">
          ${esc(item.type)}
        </span>

        <p>
          ${esc(item.description)}
        </p>

        <a
          class="btn"
          href="${esc(item.url)}"
          target="_blank"
          rel="noopener noreferrer"
        >
          🔗 Open Relevant Page
        </a>

        ${
          isAdmin
            ? `
              <button
                class="danger"
                onclick="delR(${item.id})"
              >
                Delete
              </button>
            `
            : ""
        }

      </div>

    `).join("") ||
    `
      <div class="card">
        No resources found.
      </div>
    `;
}

function filterR() {

  const search =
    (
      document.getElementById("rs")
        ?.value || ""
    ).toLowerCase();

  const type =
    document.getElementById("rt")
      ?.value || "";

  const filtered =
    resources.filter(item => {

      const text =
        `${item.title} ${item.description} ${item.type}`
          .toLowerCase();

      return (
        (!search || text.includes(search)) &&
        (!type || item.type === type)
      );
    });

  drawR(filtered);
}

async function addR(event) {

  event.preventDefault();

  await api(
    "/api/resources",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify(
        Object.fromEntries(
          new FormData(event.target)
        )
      )
    }
  );

  renderLibrary();
}

async function delR(id) {

  if (!confirm("Delete resource?"))
    return;

  await api(
    "/api/resources/" + id,
    {
      method: "DELETE"
    }
  );

  renderLibrary();
}

/* =========================================================
   CODING PRACTICE
   ========================================================= */

const coding = [

  [
    "Python",
    "Python programming, algorithms and interview coding.",
    "https://www.geeksforgeeks.org/python-programming-language/"
  ],

  [
    "Java",
    "Java programming and Object-Oriented Programming.",
    "https://www.geeksforgeeks.org/java/"
  ],

  [
    "C / C++",
    "C and C++ programming fundamentals.",
    "https://www.geeksforgeeks.org/c-programming-language/"
  ],

  [
    "JavaScript",
    "JavaScript programming and web development.",
    "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/"
  ],

  [
    "SQL",
    "SQL queries and database practice.",
    "https://www.hackerrank.com/domains/sql"
  ],

  [
    "DSA",
    "Data structures and algorithms practice.",
    "https://leetcode.com/problemset/"
  ]

];

function renderCoding() {

  app.innerHTML = `

    <div class="card">

      <h2>💻 Coding Practice</h2>

      ${homeButton()}

      <p>
        Choose a topic to learn and practice.
      </p>

    </div>

    <div class="grid">

      ${coding.map(item => `

        <div class="card">

          <h3>${item[0]}</h3>

          <p>${item[1]}</p>

          <a
            class="btn"
            href="${item[2]}"
            target="_blank"
            rel="noopener noreferrer"
          >
            🚀 Start Practice
          </a>

        </div>

      `).join("")}

    </div>

  `;
}

/* =========================================================
   COMMUNICATION & ENGLISH
   ========================================================= */

const communicationTopics = [

  [
    "🎤 Self-Introduction",
    "Practice introducing yourself, your education, skills and career goals."
  ],

  [
    "🗣️ Daily Speaking Topics",
    "Speak for 2–5 minutes about college, technology, hobbies, projects and current topics."
  ],

  [
    "📖 Vocabulary",
    "Learn new professional and everyday English words."
  ],

  [
    "✍️ Grammar",
    "Practice tenses, articles, prepositions, sentence formation and common mistakes."
  ],

  [
    "💼 Common Interview English",
    "Learn professional English phrases commonly used during interviews."
  ],

  [
    "👥 Group Discussion Practice",
    "Practice expressing opinions, agreeing, disagreeing and presenting ideas confidently."
  ]

];

function renderCommunication() {

  app.innerHTML = `

    <div class="card">

      <h2>
        🗣️ Communication & English
      </h2>

      ${homeButton()}

      <p>
        Improve your English communication and confidence
        for college, placements and interviews.
      </p>

    </div>

    <div class="grid">

      ${communicationTopics.map(item => `

        <div class="card">

          <h3>${item[0]}</h3>

          <p>${item[1]}</p>

          <button
            onclick="openCommunication('${item[0]}')"
          >
            Practice
          </button>

        </div>

      `).join("")}

    </div>

  `;
}

function openCommunication(topic) {

  const content = {

    "🎤 Self-Introduction": `
      <h3>Sample Self-Introduction</h3>
      <p>
        Good morning. My name is Adarsh Anand Patil.
        I am an engineering student specializing in Computer Science.
        I am interested in software development, programming
        and learning new technologies.
      </p>
      <p>
        I have worked on academic and personal projects and
        I am continuously improving my technical and communication
        skills. My goal is to start my career in the software
        industry and contribute to a good organization.
      </p>
    `,

    "🗣️ Daily Speaking Topics": `
      <h3>Today's Speaking Topics</h3>
      <ul>
        <li>Tell me about your college.</li>
        <li>Explain your final-year project.</li>
        <li>Why did you choose Computer Science?</li>
        <li>What are your career goals?</li>
        <li>What technology are you currently learning?</li>
      </ul>
    `,

    "📖 Vocabulary": `
      <h3>Professional Vocabulary</h3>
      <ul>
        <li>Collaborate – work together</li>
        <li>Adaptable – able to adjust to change</li>
        <li>Innovative – introducing new ideas</li>
        <li>Reliable – dependable</li>
        <li>Proactive – taking action before being asked</li>
        <li>Efficient – achieving results with minimum waste</li>
      </ul>
    `,

    "✍️ Grammar": `
      <h3>Grammar Practice</h3>
      <ul>
        <li>Practice present, past and future tense.</li>
        <li>Learn articles: a, an and the.</li>
        <li>Practice prepositions.</li>
        <li>Improve sentence formation.</li>
        <li>Avoid common grammar mistakes.</li>
      </ul>
    `,

    "💼 Common Interview English": `
      <h3>Useful Interview Phrases</h3>
      <ul>
        <li>Thank you for giving me this opportunity.</li>
        <li>I would like to explain my approach.</li>
        <li>One of my strengths is...</li>
        <li>I am currently improving...</li>
        <li>Could you please clarify the question?</li>
      </ul>
    `,

    "👥 Group Discussion Practice": `
      <h3>GD Topics</h3>
      <ul>
        <li>Artificial Intelligence: opportunity or threat?</li>
        <li>Work from home vs office.</li>
        <li>Social media and students.</li>
        <li>Importance of communication skills.</li>
        <li>Technology and future employment.</li>
      </ul>
    `

  };

  app.innerHTML = `

    <div class="card">

      <h2>🗣️ ${esc(topic)}</h2>

      ${homeButton()}

      ${content[topic] || ""}

    </div>

  `;
}

/* =========================================================
   TECHNICAL SKILLS
   ========================================================= */

const technicalSkills = [

  ["C / C++",
   "Programming fundamentals, pointers, memory and STL."],

  ["Python",
   "Syntax, functions, OOP, modules and problem solving."],

  ["Java",
   "Java fundamentals, OOP, collections and exceptions."],

  ["JavaScript",
   "JavaScript fundamentals, DOM, ES6 and asynchronous programming."],

  ["SQL",
   "Queries, joins, grouping, subqueries and database operations."],

  ["DSA",
   "Arrays, strings, linked lists, stacks, queues, trees and graphs."],

  ["DBMS",
   "Database concepts, normalization, keys, transactions and SQL."],

  ["Operating Systems",
   "Processes, threads, scheduling, memory and file systems."],

  ["Computer Networks",
   "OSI, TCP/IP, protocols, IP addressing and networking basics."],

  ["OOP",
   "Encapsulation, inheritance, polymorphism and abstraction."],

  ["Web Development",
   "HTML, CSS, JavaScript, frontend, backend and APIs."]

];

function renderTechnical() {

  app.innerHTML = `

    <div class="card">

      <h2>🛠️ Technical Skills</h2>

      ${homeButton()}

      <p>
        Important technical subjects and programming skills
        for software engineering placements.
      </p>

    </div>

    <div class="grid">

      ${technicalSkills.map(item => `

        <div class="card">

          <h3>🛠️ ${item[0]}</h3>

          <p>${item[1]}</p>

          <button
            onclick="technicalDetails('${item[0]}')"
          >
            Learn Topics
          </button>

        </div>

      `).join("")}

    </div>

  `;
}

function technicalDetails(name) {

  const topics = {

    "C / C++":
      "Variables, loops, functions, pointers, arrays, structures, STL and memory management.",

    "Python":
      "Variables, data types, functions, lists, dictionaries, OOP, modules, exceptions and file handling.",

    "Java":
      "Classes, objects, inheritance, interfaces, exceptions, collections and multithreading.",

    "JavaScript":
      "Variables, functions, arrays, objects, DOM, events, promises, async/await and APIs.",

    "SQL":
      "SELECT, WHERE, JOIN, GROUP BY, HAVING, subqueries, constraints and aggregate functions.",

    "DSA":
      "Arrays, strings, linked lists, stacks, queues, recursion, sorting, searching, trees and graphs.",

    "DBMS":
      "ER model, keys, normalization, transactions, ACID properties and indexing.",

    "Operating Systems":
      "Processes, threads, CPU scheduling, deadlocks, memory management and virtual memory.",

    "Computer Networks":
      "OSI model, TCP/IP, HTTP, DNS, IP addressing, routing and network security basics.",

    "OOP":
      "Classes, objects, encapsulation, abstraction, inheritance and polymorphism.",

    "Web Development":
      "HTML, CSS, JavaScript, responsive design, frontend, backend, REST APIs and databases."

  };

  app.innerHTML = `

    <div class="card">

      <h2>🛠️ ${esc(name)}</h2>

      ${homeButton()}

      <h3>Important Topics</h3>

      <p>
        ${esc(topics[name])}
      </p>

      <div class="notice">

        <b>Placement Tip:</b>

        Learn the fundamentals first, then solve
        interview questions and coding problems
        related to this topic.

      </div>

    </div>

  `;
}

/* =========================================================
   INTERVIEW PREPARATION
   ========================================================= */

const interviewSections = [

  [
    "👨‍💼 HR Questions",
    "Tell me about yourself, why should we hire you, career goals and company-related questions."
  ],

  [
    "💻 Technical Questions",
    "Programming, OOP, DBMS, OS, networks, SQL and DSA interview questions."
  ],

  [
    "🎤 Self-Introduction",
    "Prepare a confident 60–90 second professional introduction."
  ],

  [
    "💪 Strengths & Weaknesses",
    "Learn how to explain strengths and weaknesses professionally."
  ],

  [
    "🚀 Project Explanation",
    "Explain your project, problem statement, technologies, modules and your contribution."
  ],

  [
    "❓ Common Interview Questions",
    "Practice frequently asked technical and HR questions."
  ]

];

function renderInterview() {

  app.innerHTML = `

    <div class="card">

      <h2>🎤 Interview Preparation</h2>

      ${homeButton()}

      <p>
        Prepare for HR, technical and project-based interviews.
      </p>

    </div>

    <div class="grid">

      ${interviewSections.map(item => `

        <div class="card">

          <h3>${item[0]}</h3>

          <p>${item[1]}</p>

          <button
            onclick="interviewDetails('${item[0]}')"
          >
            Practice
          </button>

        </div>

      `).join("")}

    </div>

  `;
}

function interviewDetails(name) {

  let content = "";

  if (name === "👨‍💼 HR Questions") {

    content = `
      <ul>
        <li>Tell me about yourself.</li>
        <li>Why should we hire you?</li>
        <li>Why do you want to join our company?</li>
        <li>Where do you see yourself in five years?</li>
        <li>Why should we select you?</li>
      </ul>
    `;

  } else if (name === "💻 Technical Questions") {

    content = `
      <ul>
        <li>What are the four pillars of OOP?</li>
        <li>Difference between process and thread?</li>
        <li>What is normalization in DBMS?</li>
        <li>Difference between TCP and UDP?</li>
        <li>What is a primary key?</li>
        <li>What is the difference between stack and queue?</li>
      </ul>
    `;

  } else if (name === "🎤 Self-Introduction") {

    content = `
      <p>
        Prepare a 60–90 second introduction covering:
      </p>
      <ol>
        <li>Name and education</li>
        <li>Technical skills</li>
        <li>Projects</li>
        <li>Internship or achievements</li>
        <li>Career goal</li>
      </ol>
    `;

  } else if (name === "💪 Strengths & Weaknesses") {

    content = `
      <h3>Strength Examples</h3>
      <ul>
        <li>Quick learner</li>
        <li>Problem-solving ability</li>
        <li>Teamwork</li>
        <li>Adaptability</li>
      </ul>

      <h3>Weakness Examples</h3>
      <p>
        Mention a genuine area you are improving and
        explain what you are doing to improve it.
      </p>
    `;

  } else if (name === "🚀 Project Explanation") {

    content = `
      <ol>
        <li>Project title</li>
        <li>Problem statement</li>
        <li>Objective</li>
        <li>Technologies used</li>
        <li>System modules</li>
        <li>Your contribution</li>
        <li>Challenges faced</li>
        <li>Result and future scope</li>
      </ol>
    `;

  } else {

    content = `
      <ul>
        <li>Tell me about yourself.</li>
        <li>Explain your final-year project.</li>
        <li>What are your technical skills?</li>
        <li>What is OOP?</li>
        <li>What is DBMS?</li>
        <li>What is DSA?</li>
        <li>Why do you want this job?</li>
      </ul>
    `;
  }

  app.innerHTML = `

    <div class="card">

      <h2>🎤 ${esc(name)}</h2>

      ${homeButton()}

      ${content}

    </div>

  `;
}

/* =========================================================
   JOB PREPARATION ROADMAP
   ========================================================= */

const roadmapSteps = [

  ["1️⃣ Learn Fundamentals",
   "Strengthen programming basics, computer fundamentals and problem solving."],

  ["2️⃣ Coding + DSA",
   "Practice programming and solve DSA problems regularly."],

  ["3️⃣ Aptitude",
   "Practice quantitative aptitude, logical reasoning and verbal ability."],

  ["4️⃣ Communication",
   "Improve English speaking, vocabulary and interview communication."],

  ["5️⃣ Projects",
   "Build useful projects and understand every part of your project."],

  ["6️⃣ Resume",
   "Create a clean, professional and ATS-friendly resume."],

  ["7️⃣ Apply for Jobs",
   "Apply through company career pages, LinkedIn, job portals and referrals."],

  ["8️⃣ Technical Interview",
   "Prepare programming, DSA, DBMS, OS, networks and project questions."],

  ["9️⃣ HR Interview",
   "Practice self-introduction, strengths, weaknesses and behavioural questions."]

];

function renderRoadmap() {

  app.innerHTML = `

    <div class="card">

      <h2>🚀 Job Preparation Roadmap</h2>

      ${homeButton()}

      <p>
        Follow this roadmap step-by-step to prepare
        for software and engineering jobs.
      </p>

    </div>

    <div class="grid">

      ${roadmapSteps.map((item, index) => `

        <div class="card">

          <h3>${item[0]}</h3>

          <p>${item[1]}</p>

          <button
            onclick="roadmapStep(${index})"
          >
            View Guidance
          </button>

        </div>

      `).join("")}

    </div>

  `;
}

function roadmapStep(index) {

  const step = roadmapSteps[index];

  app.innerHTML = `

    <div class="card">

      <h2>${step[0]}</h2>

      ${homeButton()}

      <p>${step[1]}</p>

      <div class="notice">

        <b>Recommended approach:</b>

        <p>
          Spend consistent time every day on this step.
          Track your progress and revise regularly.
        </p>

      </div>

    </div>

  `;
}

/* =========================================================
   DAILY PRACTICE
   ========================================================= */

const dailyPractice = [

  [
    "🗣️ English Speaking",
    "Speak for 5–10 minutes about a topic without reading."
  ],

  [
    "💻 Coding",
    "Solve at least one programming or DSA problem."
  ],

  [
    "🎯 Aptitude",
    "Practice quantitative, logical or verbal aptitude."
  ],

  [
    "🛠️ Technical Questions",
    "Answer 5 technical interview questions aloud."
  ]

];

function renderDaily() {

  app.innerHTML = `

    <div class="card">

      <h2>📅 Daily Practice</h2>

      ${homeButton()}

      <p>
        A simple daily routine for placement preparation.
      </p>

    </div>

    <div class="grid">

      ${dailyPractice.map(item => `

        <div class="card">

          <h3>${item[0]}</h3>

          <p>${item[1]}</p>

          <button
            onclick="startDailyPractice('${item[0]}')"
          >
            Start
          </button>

        </div>

      `).join("")}

    </div>

    <div class="card">

      <h3>✅ Suggested Daily Routine</h3>

      <ol>
        <li>10 minutes English speaking</li>
        <li>30–45 minutes coding/DSA</li>
        <li>20 minutes aptitude</li>
        <li>20 minutes technical interview questions</li>
        <li>10 minutes revision</li>
      </ol>

    </div>

  `;
}

function startDailyPractice(topic) {

  app.innerHTML = `

    <div class="card">

      <h2>${esc(topic)}</h2>

      ${homeButton()}

      <div class="notice">

        <h3>Today's Practice</h3>

        <p>
          Spend at least 10–20 minutes practicing
          this skill today.
        </p>

      </div>

      <textarea
        id="practiceAnswer"
        placeholder="Write your answer, notes or practice here..."
      ></textarea>

      <button onclick="savePracticeNote()">
        💾 Save Practice Note
      </button>

    </div>

  `;
}

function savePracticeNote() {

  const value =
    document.getElementById(
      "practiceAnswer"
    )?.value.trim();

  if (!value)
    return alert("Write something before saving.");

  localStorage.setItem(
    "dailyPracticeNote",
    value
  );

  alert(
    "Practice note saved on this device."
  );
}

/* =========================================================
   PLACEMENTS
   ========================================================= */

async function renderPlacements() {

  try {

    const data =
      await api("/api/resources");

    app.innerHTML = `

      <div class="card">

        <h2>💼 Placement Preparation</h2>

        ${homeButton()}

        <p>
          Aptitude, coding, technical and interview preparation.
        </p>

      </div>

      <div class="grid">

        ${
          data
            .filter(item =>
              [
                "Placement",
                "Aptitude",
                "Coding",
                "Technical",
                "Interview"
              ].includes(item.type)
            )
            .map(item => `

              <div class="card">

                <h3>
                  ${esc(item.title)}
                </h3>

                <p>
                  ${esc(item.description)}
                </p>

                <a
                  class="btn"
                  href="${esc(item.url)}"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Relevant Page
                </a>

              </div>

            `)
            .join("")
        }

      </div>

    `;

  } catch (error) {

    app.innerHTML = `
      <div class="card">
        <h2>Placement Preparation</h2>
        ${homeButton()}
        <p>${esc(error.message)}</p>
      </div>
    `;
  }
}

/* =========================================================
   APTITUDE
   ========================================================= */

async function renderAptitude() {

  const data =
    await api("/api/resources");

  app.innerHTML = `

    <div class="card">

      <h2>🎯 Aptitude Tests & Practice</h2>

      ${homeButton()}

      <p>
        Practice quantitative aptitude, reasoning and verbal ability.
      </p>

    </div>

    ${
      data
        .filter(item =>
          item.type === "Aptitude"
        )
        .map(item => `

          <div class="card">

            <h3>
              ${esc(item.title)}
            </h3>

            <p>
              ${esc(item.description)}
            </p>

            <a
              class="btn"
              href="${esc(item.url)}"
              target="_blank"
              rel="noopener noreferrer"
            >
              Practice
            </a>

          </div>

        `)
        .join("")
    }

  `;
}

/* =========================================================
   INTERNSHIPS
   ========================================================= */

function renderInternships() {

  app.innerHTML = `

    <div class="card">

      <h2>🏢 Internships</h2>

      ${homeButton()}

      <p>
        Find internship opportunities and gain industry experience.
      </p>

    </div>

    <div class="grid">

      <div class="card">

        <h3>LinkedIn Jobs</h3>

        <a
          class="btn"
          href="https://www.linkedin.com/jobs/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open
        </a>

      </div>

      <div class="card">

        <h3>Internshala</h3>

        <a
          class="btn"
          href="https://internshala.com/internships/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open
        </a>

      </div>

    </div>

  `;
}

/* =========================================================
   RESUME BUILDER
   ========================================================= */

function renderResume() {

  app.innerHTML = `

    <div class="card">

      <h2>📝 Resume Builder</h2>

      ${homeButton()}

      <div class="formgrid">

        <div>
          <label>Name</label>
          <input id="rn">
        </div>

        <div>
          <label>Email</label>
          <input id="re">
        </div>

        <div>
          <label>Phone</label>
          <input id="rp">
        </div>

        <div>
          <label>College</label>
          <input id="rc">
        </div>

      </div>

      <label>Skills</label>
      <textarea id="rs1"></textarea>

      <label>Projects</label>
      <textarea id="rpr"></textarea>

      <label>Education</label>
      <textarea id="red"></textarea>

      <button onclick="resume()">
        Generate Resume
      </button>

    </div>

    <div id="ro"></div>

  `;
}

function resume() {

  const get =
    id =>
      document.getElementById(id).value;

  document.getElementById(
    "ro"
  ).innerHTML = `

    <div class="card">

      <h1>
        ${esc(get("rn"))}
      </h1>

      <p>
        ${esc(get("re"))}
        •
        ${esc(get("rp"))}
      </p>

      <p>
        ${esc(get("rc"))}
      </p>

      <h2>Education</h2>

      <p>${esc(get("red"))}</p>

      <h2>Skills</h2>

      <p>${esc(get("rs1"))}</p>

      <h2>Projects</h2>

      <p>${esc(get("rpr"))}</p>

    </div>

  `;
}

/* =========================================================
   ANNOUNCEMENTS
   ========================================================= */

async function renderAnnouncements() {

  announcements =
    await api("/api/announcements");

  app.innerHTML = `

    <div class="card">

      <h2>📢 Announcements</h2>

      ${homeButton()}

      ${
        isAdmin
          ? `

            <form id="af">

              <label>Title</label>

              <input
                name="title"
                required
              >

              <label>Message</label>

              <textarea
                name="message"
                required
              ></textarea>

              <label>Date</label>

              <input
                name="date"
                type="date"
              >

              <button>
                Add Announcement
              </button>

            </form>

          `
          : ""
      }

    </div>

    ${
      announcements
        .map(item => `

          <div class="card">

            <h3>
              ${esc(item.title)}
            </h3>

            <p>
              ${esc(item.message)}
            </p>

            <small>
              ${esc(item.date || "")}
            </small>

            ${
              isAdmin
                ? `
                  <br><br>

                  <button
                    class="danger"
                    onclick="delA(${item.id})"
                  >
                    Delete
                  </button>
                `
                : ""
            }

          </div>

        `)
        .join("")
    }

  `;

  document
    .getElementById("af")
    ?.addEventListener(
      "submit",
      addA
    );
}

async function addA(event) {

  event.preventDefault();

  await api(
    "/api/announcements",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify(
        Object.fromEntries(
          new FormData(event.target)
        )
      )
    }
  );

  renderAnnouncements();
}

async function delA(id) {

  if (!confirm("Delete announcement?"))
    return;

  await api(
    "/api/announcements/" + id,
    {
      method: "DELETE"
    }
  );

  renderAnnouncements();
}

/* =========================================================
   PROJECTS
   ========================================================= */

async function renderProjects() {

  projects =
    await api("/api/projects");

  app.innerHTML = `

    <div class="card">

      <h2>🚀 Engineering Project Ideas</h2>

      ${homeButton()}

      ${
        isAdmin
          ? `

            <form id="pf">

              <label>Title</label>

              <input
                name="title"
                required
              >

              <label>Description</label>

              <textarea
                name="description"
                required
              ></textarea>

              <label>Technologies</label>

              <input name="technologies">

              <label>Difficulty</label>

              <select name="difficulty">

                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>

              </select>

              <button>
                Add Project
              </button>

            </form>

          `
          : ""
      }

    </div>

    ${
      projects
        .map(item => `

          <div class="card">

            <h3>
              ${esc(item.title)}
            </h3>

            <p>
              ${esc(item.description)}
            </p>

            <p>
              <b>Technologies:</b>
              ${esc(item.technologies || "")}
            </p>

            ${
              isAdmin
                ? `
                  <button
                    class="danger"
                    onclick="delP(${item.id})"
                  >
                    Delete
                  </button>
                `
                : ""
            }

          </div>

        `)
        .join("")
    }

  `;

  document
    .getElementById("pf")
    ?.addEventListener(
      "submit",
      addP
    );
}

async function addP(event) {

  event.preventDefault();

  await api(
    "/api/projects",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify(
        Object.fromEntries(
          new FormData(event.target)
        )
      )
    }
  );

  renderProjects();
}

async function delP(id) {

  if (!confirm("Delete project?"))
    return;

  await api(
    "/api/projects/" + id,
    {
      method: "DELETE"
    }
  );

  renderProjects();
}

/* =========================================================
   CALENDAR + HOLIDAYS
   ========================================================= */

async function renderCalendar() {

  calendarEvents =
    await api("/api/calendar");

  app.innerHTML = `

    <div class="card">

      <h2>📅 Academic Calendar</h2>

      ${homeButton()}

      <p>
        View exams, semester dates, holidays
        and important academic events.
      </p>

      ${
        isAdmin
          ? `

            <form id="cf">

              <div class="formgrid">

                <div>

                  <label>
                    Event / Holiday Name
                  </label>

                  <input
                    name="title"
                    required
                    placeholder="Ganesh Chaturthi"
                  >

                </div>

                <div>

                  <label>Date</label>

                  <input
                    name="date"
                    type="date"
                    required
                  >

                </div>

                <div>

                  <label>Type</label>

                  <select name="type">

                    <option>Holiday</option>
                    <option>Exam</option>
                    <option>Internal Exam</option>
                    <option>Practical</option>
                    <option>Semester</option>
                    <option>Other</option>

                  </select>

                </div>

              </div>

              <label>Description</label>

              <textarea
                name="description"
              ></textarea>

              <button>
                ➕ Add Event / Holiday
              </button>

            </form>

          `
          : ""
      }

    </div>

    <div class="card">

      <div class="table-wrap">

        <table>

          <tr>

            <th>Event</th>
            <th>Date</th>
            <th>Type</th>
            <th>Description</th>

            ${
              isAdmin
                ? "<th>Action</th>"
                : ""
            }

          </tr>

          ${
            calendarEvents
              .sort(
                (a, b) =>
                  String(a.date)
                    .localeCompare(
                      String(b.date)
                    )
              )
              .map(item => `

                <tr>

                  <td>
                    ${esc(item.title)}
                  </td>

                  <td>
                    ${esc(item.date)}
                  </td>

                  <td>
                    ${esc(item.type)}
                  </td>

                  <td>
                    ${esc(
                      item.description || ""
                    )}
                  </td>

                  ${
                    isAdmin
                      ? `
                        <td>

                          <button
                            class="danger"
                            onclick="delC(${item.id})"
                          >
                            Delete
                          </button>

                        </td>
                      `
                      : ""
                  }

                </tr>

              `)
              .join("")
          }

        </table>

      </div>

    </div>

  `;

  document
    .getElementById("cf")
    ?.addEventListener(
      "submit",
      addC
    );
}

async function addC(event) {

  event.preventDefault();

  await api(
    "/api/calendar",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify(
        Object.fromEntries(
          new FormData(event.target)
        )
      )
    }
  );

  alert(
    "Calendar event/holiday added."
  );

  renderCalendar();
}

async function delC(id) {

  if (!confirm(
    "Delete this event/holiday?"
  ))
    return;

  await api(
    "/api/calendar/" + id,
    {
      method: "DELETE"
    }
  );

  renderCalendar();
}

/* =========================================================
   USEFUL LINKS
   ========================================================= */

function renderLinks() {

  app.innerHTML = `

    <div class="card">

      <h2>
        🔗 Useful Engineering Links
      </h2>

      ${homeButton()}

      <div class="grid">

        <div class="card">
          <h3>VTU</h3>
          <a
            class="btn"
            href="https://vtu.ac.in/"
            target="_blank"
          >
            Open
          </a>
        </div>

        <div class="card">
          <h3>NPTEL Courses</h3>
          <a
            class="btn"
            href="https://nptel.ac.in/courses"
            target="_blank"
          >
            Open
          </a>
        </div>

        <div class="card">
          <h3>SWAYAM</h3>
          <a
            class="btn"
            href="https://swayam.gov.in/explorer"
            target="_blank"
          >
            Open
          </a>
        </div>

        <div class="card">
          <h3>GitHub</h3>
          <a
            class="btn"
            href="https://github.com/"
            target="_blank"
          >
            Open
          </a>
        </div>

      </div>

    </div>

  `;
}

/* =========================================================
   LOGIN
   ========================================================= */

function renderLogin() {

  if (isAdmin)
    return showPage("admin");

  app.innerHTML = `

    <div class="card login-card">

      <h2>
        🔐 Creator / Admin Login
      </h2>

      <div class="notice">
        Students do not need to login.
      </div>

      <form id="lf">

        <label>Email</label>

        <input
          name="email"
          type="email"
          value="admin@college.com"
          required
        >

        <label>Password</label>

        <input
          name="password"
          type="password"
          required
        >

        <button>
          Login
        </button>

      </form>

    </div>

  `;

  document
    .getElementById("lf")
    .addEventListener(
      "submit",
      login
    );
}

async function login(event) {

  event.preventDefault();

  try {

    const result =
      await api(
        "/api/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify(
            Object.fromEntries(
              new FormData(event.target)
            )
          )
        }
      );

    adminToken =
      result.token;

    isAdmin = true;

    localStorage.setItem(
      "adminToken",
      adminToken
    );

    updateNavigation();

    showPage("admin");

  } catch (error) {

    alert(error.message);

  }
}

function logout() {

  adminToken = null;
  isAdmin = false;

  localStorage.removeItem(
    "adminToken"
  );

  updateNavigation();

  showPage("home");
}

/* =========================================================
   ADMIN DASHBOARD
   ========================================================= */

function renderAdmin() {

  if (!isAdmin)
    return showPage("login");

  app.innerHTML = `

    <div class="hero">

      <h1>
        🔐 Creator / Admin Dashboard
      </h1>

      <p>
        Manage portal content.
      </p>

      <button
        class="secondary"
        onclick="logout()"
      >
        Logout
      </button>

    </div>

    <div class="grid">

      <div class="card">
        <h3>📚 Resources</h3>
        <button
          onclick="showPage('library')"
        >
          Manage
        </button>
      </div>

      <div class="card">
        <h3>📢 Announcements</h3>
        <button
          onclick="showPage('announcements')"
        >
          Manage
        </button>
      </div>

      <div class="card">
        <h3>🚀 Projects</h3>
        <button
          onclick="showPage('projects')"
        >
          Manage
        </button>
      </div>

      <div class="card">

        <h3>
          📅 Calendar & Holidays
        </h3>

        <button
          onclick="showPage('calendar')"
        >
          Manage
        </button>

      </div>

      <div class="card">

        <h3>🎓 Results</h3>

        <button
          onclick="showPage('results')"
        >
          Open Results
        </button>

      </div>

    </div>

  `;
}

/* =========================================================
   START
   ========================================================= */

updateNavigation();

showPage("home");
