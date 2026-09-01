const app = document.getElementById("app");

let adminToken = localStorage.getItem("adminToken");
let isAdmin = !!adminToken;

let resources = [];
let announcements = [];
let projects = [];
let calendarEvents = [];

/* ---------------- HELPERS ---------------- */

const esc = value =>
  String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));

/* ---------------- API ---------------- */

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

    throw new Error(data.message || "Request failed.");
  }

  return data;
}

/* ---------------- NAVIGATION ---------------- */

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
    login: renderLogin,
    admin: renderAdmin
  };

  (pages[page] || renderHome)();
}

/* ---------------- HOME ---------------- */

const homeButton = () => `
  <button
    class="secondary"
    onclick="showPage('home')"
  >
    🏠 Back to Home
  </button>
`;

function renderHome() {

  const cards = [
    ["📚 E-Library", "Study materials and resources.", "library"],
    ["🎓 Results", "Semester results and CGPA.", "results"],
    ["💼 Placements", "Placement preparation.", "placements"],
    ["💻 Coding Practice", "Programming, DSA and SQL.", "coding"],
    ["🎯 Aptitude", "Aptitude practice.", "aptitude"],
    ["🏢 Internships", "Internship opportunities.", "internships"],
    ["📝 Resume Builder", "Create a simple resume.", "resume"],
    ["🚀 Project Ideas", "Engineering project ideas.", "projects"],
    ["📅 Academic Calendar", "Exams, holidays and events.", "calendar"]
  ];

  app.innerHTML = `
    <section class="hero">

      <h1>🎓 Engineering Student Portal</h1>

      <p class="created-by">
        Created by Adarsh Anand Patil
      </p>

      <p>
        Study, placements, coding, results and
        career resources in one place.
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

function renderResults() {

  app.innerHTML = `

    <div class="card">

      <h2>🎓 VTU Results & Academic Performance</h2>

      ${homeButton()}

      <p>
        Check your official VTU result and maintain
        your semester-wise subject results here.
      </p>

      <div class="notice">

        <b>Official VTU Results</b>

        <p>
          Click the button below to open the official
          VTU results portal. Enter your USN and required
          details to view your result.
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


    <!-- SEMESTER RESULTS -->

    <div class="card">

      <h2>📚 Semester-wise Subject Results</h2>

      <p class="muted">
        Enter the subject, grade, grade point and credits
        for each semester.
      </p>

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
            placeholder="Example: 9"
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
            placeholder="Example: 4"
          >

        </div>

      </div>

      <button onclick="addSemesterResult()">
        ➕ Add Subject Result
      </button>

    </div>


    <!-- RESULT TABLE -->

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

          <tbody id="semesterResultTable">

          </tbody>

        </table>

      </div>

      <div id="semesterResultMessage"></div>

    </div>


    <!-- OVERALL CGPA -->

    <div class="card">

      <h2>📈 Overall CGPA</h2>

      <p>
        Enter your semester SGPA values to calculate
        your overall CGPA.
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
                data-semester="${i + 1}"
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


/* ---------------- SEMESTER RESULT STORAGE ---------------- */

let semesterResults =
  JSON.parse(
    localStorage.getItem("semesterResults") || "[]"
  );


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
      "Please enter subject, grade, grade point and credits."
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
    document.getElementById("semesterResultTable");

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
      (a, b) =>
        a.semester - b.semester
    );


  table.innerHTML = sorted.map(item => `

    <tr>

      <td>
        ${item.semester}
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

  if (
    !confirm(
      "Delete this subject result?"
    )
  ) {
    return;
  }


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


/* ---------------- OVERALL CGPA ---------------- */

function calculateOverallCGPA() {

  const inputs = [
    ...document.querySelectorAll(
      ".semester-sgpa"
    )
  ];


  const values =
    inputs
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
        Based on ${values.length}
        semester(s).
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

        <h3>
          ${esc(item.title)}
        </h3>

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

      const text = `
        ${item.title}
        ${item.description}
        ${item.type}
      `.toLowerCase();


      return (
        (!search ||
          text.includes(search)) &&
        (!type ||
          item.type === type)
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

  if (
    confirm("Delete resource?")
  ) {

    await api(
      "/api/resources/" + id,
      {
        method: "DELETE"
      }
    );

    renderLibrary();

  }
}


/* =========================================================
   CODING
   ========================================================= */

const coding = [

  [
    "Python",
    "Python programming and algorithms.",
    "https://www.geeksforgeeks.org/python-programming-language/"
  ],

  [
    "Java",
    "Java programming and OOP.",
    "https://www.geeksforgeeks.org/java/"
  ],

  [
    "C / C++",
    "C/C++ programming and DSA.",
    "https://www.geeksforgeeks.org/c-programming-language/"
  ],

  [
    "JavaScript",
    "JavaScript algorithms and data structures.",
    "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/"
  ],

  [
    "SQL",
    "SQL practice problems.",
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
        Choose a topic to open a relevant
        learning and practice page.
      </p>

    </div>

    <div class="grid">

      ${coding.map(item => `

        <div class="card">

          <h3>
            ${item[0]}
          </h3>

          <p>
            ${item[1]}
          </p>

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
   PLACEMENTS
   ========================================================= */

async function renderPlacements() {

  const data =
    await api("/api/resources");


  app.innerHTML = `

    <div class="card">

      <h2>
        💼 Placement Preparation
      </h2>

      ${homeButton()}

      <p>
        Aptitude, coding, technical and
        interview preparation.
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
}


/* =========================================================
   APTITUDE
   ========================================================= */

async function renderAptitude() {

  const data =
    await api("/api/resources");


  app.innerHTML = `

    <div class="card">

      <h2>
        🎯 Aptitude Tests & Practice
      </h2>

      ${homeButton()}

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
        Find internship opportunities.
      </p>

    </div>

    <div class="grid">

      <div class="card">

        <h3>
          LinkedIn Jobs
        </h3>

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

        <h3>
          Internshala
        </h3>

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
   RESUME
   ========================================================= */

function renderResume() {

  app.innerHTML = `

    <div class="card">

      <h2>
        📝 Resume Builder
      </h2>

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

      <h2>
        Education
      </h2>

      <p>
        ${esc(get("red"))}
      </p>

      <h2>
        Skills
      </h2>

      <p>
        ${esc(get("rs1"))}
      </p>

      <h2>
        Projects
      </h2>

      <p>
        ${esc(get("rpr"))}
      </p>

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

      <h2>
        📢 Announcements
      </h2>

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

  if (
    confirm(
      "Delete announcement?"
    )
  ) {

    await api(
      "/api/announcements/" + id,
      {
        method: "DELETE"
      }
    );

    renderAnnouncements();

  }
}


/* =========================================================
   PROJECTS
   ========================================================= */

async function renderProjects() {

  projects =
    await api("/api/projects");


  app.innerHTML = `

    <div class="card">

      <h2>
        🚀 Engineering Project Ideas
      </h2>

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

              <input
                name="technologies"
              >

              <label>Difficulty</label>

              <select name="difficulty">

                <option>
                  Beginner
                </option>

                <option>
                  Intermediate
                </option>

                <option>
                  Advanced
                </option>

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

  if (
    confirm("Delete project?")
  ) {

    await api(
      "/api/projects/" + id,
      {
        method: "DELETE"
      }
    );

    renderProjects();

  }
}


/* =========================================================
   CALENDAR
   ========================================================= */

async function renderCalendar() {

  calendarEvents =
    await api("/api/calendar");


  app.innerHTML = `

    <div class="card">

      <h2>
        📅 Academic Calendar
      </h2>

      ${homeButton()}

      <p>
        View exams, semester dates,
        holidays and important events.
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

                    <option>
                      Holiday
                    </option>

                    <option>
                      Exam
                    </option>

                    <option>
                      Internal Exam
                    </option>

                    <option>
                      Practical
                    </option>

                    <option>
                      Semester
                    </option>

                    <option>
                      Other
                    </option>

                  </select>

                </div>

              </div>

              <label>
                Description
              </label>

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

  if (
    confirm(
      "Delete this event/holiday?"
    )
  ) {

    await api(
      "/api/calendar/" + id,
      {
        method: "DELETE"
      }
    );

    renderCalendar();

  }
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

          <h3>
            NPTEL Courses
          </h3>

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

  if (isAdmin) {
    return showPage("admin");
  }


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

  if (!isAdmin) {
    return showPage("login");
  }


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

        <h3>
          🎓 Results
        </h3>

        <p>
          View the semester result
          section.
        </p>

        <button
          onclick="showPage('results')"
        >
          Open Results
        </button>

      </div>

    </div>

  `;
}


/* ---------------- START ---------------- */

updateNavigation();

showPage("home");
