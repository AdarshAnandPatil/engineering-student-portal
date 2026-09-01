const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const app = express();

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret";

const dataDir = path.join(__dirname, "data");
const publicDir = path.join(__dirname, "public");

fs.mkdirSync(dataDir, { recursive: true });

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicDir));

/* =========================
   DATA FILES
========================= */

const files = {
  resources: path.join(dataDir, "resources.json"),
  announcements: path.join(dataDir, "announcements.json"),
  projects: path.join(dataDir, "projects.json"),
  calendar: path.join(dataDir, "calendar.json"),

  communication: path.join(dataDir, "communication.json"),
  interviews: path.join(dataDir, "interviews.json"),
  technical: path.join(dataDir, "technical.json"),
  companies: path.join(dataDir, "companies.json"),
  jobs: path.join(dataDir, "jobs.json")
};

/* =========================
   FILE HELPERS
========================= */

function read(file, defaultValue = []) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return defaultValue;
  }
}

function write(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function createFileIfMissing(file, data = []) {
  if (!fs.existsSync(file)) {
    write(file, data);
  }
}

/* =========================
   DEFAULT RESOURCES
========================= */

createFileIfMissing(files.resources, [
  {
    id: 1,
    type: "Coding",
    title: "GeeksforGeeks",
    description: "DSA, programming and interview preparation.",
    url: "https://www.geeksforgeeks.org/data-structures/"
  },
  {
    id: 2,
    type: "Coding",
    title: "LeetCode",
    description: "Coding problems and interview practice.",
    url: "https://leetcode.com/problemset/"
  },
  {
    id: 3,
    type: "Coding",
    title: "HackerRank",
    description: "Programming and SQL practice.",
    url: "https://www.hackerrank.com/domains"
  },
  {
    id: 4,
    type: "Learning",
    title: "freeCodeCamp",
    description: "Free programming and web development courses.",
    url: "https://www.freecodecamp.org/learn/"
  },
  {
    id: 5,
    type: "Learning",
    title: "NPTEL",
    description: "Engineering courses from IITs and IISc.",
    url: "https://nptel.ac.in/courses"
  },
  {
    id: 6,
    type: "Learning",
    title: "SWAYAM",
    description: "Online courses and learning resources.",
    url: "https://swayam.gov.in/explorer"
  },
  {
    id: 7,
    type: "Aptitude",
    title: "IndiaBix",
    description: "Quantitative aptitude, reasoning and verbal practice.",
    url: "https://www.indiabix.com/aptitude/questions-and-answers/"
  },
  {
    id: 8,
    type: "Technical",
    title: "Programiz",
    description: "Programming tutorials and examples.",
    url: "https://www.programiz.com/tutorial"
  },
  {
    id: 9,
    type: "Technical",
    title: "W3Schools",
    description: "Web, SQL, programming and reference tutorials.",
    url: "https://www.w3schools.com/"
  },
  {
    id: 10,
    type: "Interview",
    title: "InterviewBit",
    description: "Coding and interview preparation resources.",
    url: "https://www.interviewbit.com/courses/programming/"
  }
]);

/* =========================
   OTHER DATA FILES
========================= */

createFileIfMissing(files.announcements);
createFileIfMissing(files.projects);
createFileIfMissing(files.calendar);

/* New career files */

createFileIfMissing(files.communication, [
  {
    id: 1,
    category: "Self Introduction",
    question: "Tell me about yourself.",
    tip: "Introduce your education, technical skills, projects and career goal in a clear order."
  },
  {
    id: 2,
    category: "Communication",
    question: "What are your strengths?",
    tip: "Mention 2 or 3 genuine strengths and support them with a short example."
  },
  {
    id: 3,
    category: "Communication",
    question: "What is your weakness?",
    tip: "Mention a real weakness and explain how you are improving it."
  },
  {
    id: 4,
    category: "Speaking Practice",
    question: "Explain your final-year project in simple English.",
    tip: "Practice explaining the problem, solution, technologies, your contribution and result."
  },
  {
    id: 5,
    category: "Daily Speaking",
    question: "Speak for one minute about your career goal.",
    tip: "Speak slowly, use simple sentences and avoid memorizing every sentence."
  }
]);

createFileIfMissing(files.interviews, [
  {
    id: 1,
    category: "HR",
    question: "Tell me about yourself.",
    answer: "Give a short introduction covering your education, skills, projects and career goal."
  },
  {
    id: 2,
    category: "HR",
    question: "Why should we hire you?",
    answer: "Explain how your technical skills, willingness to learn and project experience can contribute to the company."
  },
  {
    id: 3,
    category: "HR",
    question: "Where do you see yourself in five years?",
    answer: "Talk about developing strong technical expertise and taking greater responsibility."
  },
  {
    id: 4,
    category: "HR",
    question: "Why do you want to join our company?",
    answer: "Research the company and connect its work, opportunities and values with your career goals."
  },
  {
    id: 5,
    category: "HR",
    question: "Tell me about a challenge you faced in your project.",
    answer: "Explain the problem, what you did, the solution and what you learned."
  }
]);

createFileIfMissing(files.technical, [
  {
    id: 1,
    category: "OOP",
    question: "What is Object-Oriented Programming?",
    answer: "OOP is a programming approach based on objects and concepts such as encapsulation, inheritance, polymorphism and abstraction."
  },
  {
    id: 2,
    category: "DBMS",
    question: "What is normalization?",
    answer: "Normalization organizes database tables to reduce redundancy and improve data integrity."
  },
  {
    id: 3,
    category: "SQL",
    question: "What is the difference between WHERE and HAVING?",
    answer: "WHERE filters rows before grouping, while HAVING filters groups after GROUP BY."
  },
  {
    id: 4,
    category: "OS",
    question: "What is a process?",
    answer: "A process is a program in execution."
  },
  {
    id: 5,
    category: "Computer Networks",
    question: "What is the difference between TCP and UDP?",
    answer: "TCP is connection-oriented and reliable, while UDP is connectionless and generally faster but does not guarantee delivery."
  },
  {
    id: 6,
    category: "DSA",
    question: "What is a data structure?",
    answer: "A data structure is a way of organizing and storing data so that it can be accessed and modified efficiently."
  },
  {
    id: 7,
    category: "Programming",
    question: "What is the difference between a compiler and an interpreter?",
    answer: "A compiler generally translates a program before execution, while an interpreter executes program instructions during interpretation."
  }
]);

createFileIfMissing(files.companies, [
  {
    id: 1,
    company: "TCS",
    preparation: "Aptitude, coding, communication, technical fundamentals and HR interview."
  },
  {
    id: 2,
    company: "Infosys",
    preparation: "Aptitude, logical reasoning, programming, technical interview and HR."
  },
  {
    id: 3,
    company: "Accenture",
    preparation: "Cognitive assessment, technical assessment, coding and communication."
  },
  {
    id: 4,
    company: "Wipro",
    preparation: "Aptitude, coding, technical fundamentals and interview preparation."
  },
  {
    id: 5,
    company: "Capgemini",
    preparation: "Communication, aptitude, coding, technical and HR preparation."
  }
]);

createFileIfMissing(files.jobs);

/* =========================
   ADMIN LOGIN
========================= */

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || "admin@college.com";

const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD || "admin123";

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required."
    });
  }

  if (
    email.toLowerCase() !== ADMIN_EMAIL.toLowerCase() ||
    password !== ADMIN_PASSWORD
  ) {
    return res.status(401).json({
      message: "Invalid admin login."
    });
  }

  const token = jwt.sign(
    {
      email: ADMIN_EMAIL,
      role: "admin"
    },
    JWT_SECRET,
    {
      expiresIn: "12h"
    }
  );

  res.json({
    token,
    user: {
      email: ADMIN_EMAIL,
      role: "admin"
    }
  });
});

/* =========================
   ADMIN AUTHENTICATION
========================= */

function adminOnly(req, res, next) {
  const header = req.headers.authorization || "";

  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Admin login required."
    });
  }

  try {
    const decoded = jwt.verify(
      header.slice(7),
      JWT_SECRET
    );

    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required."
      });
    }

    req.admin = decoded;
    next();

  } catch {
    return res.status(401).json({
      message: "Admin session expired. Please login again."
    });
  }
}

/* =========================
   GENERIC CRUD
========================= */

function crud(name, file, required = []) {

  /* Public GET */

  app.get("/api/" + name, (req, res) => {
    res.json(read(file));
  });

  /* Admin POST */

  app.post("/api/" + name, adminOnly, (req, res) => {

    for (const field of required) {
      if (!req.body[field]) {
        return res.status(400).json({
          message: field + " is required."
        });
      }
    }

    const data = read(file);

    const item = {
      id: Date.now(),
      ...req.body
    };

    data.unshift(item);

    write(file, data);

    res.json({
      message: name + " added successfully.",
      item
    });
  });

  /* Admin PUT */

  app.put("/api/" + name + "/:id", adminOnly, (req, res) => {

    const data = read(file);

    const index = data.findIndex(
      item =>
        String(item.id) === String(req.params.id)
    );

    if (index < 0) {
      return res.status(404).json({
        message: "Item not found."
      });
    }

    data[index] = {
      ...data[index],
      ...req.body
    };

    write(file, data);

    res.json({
      message: "Item updated successfully.",
      item: data[index]
    });
  });

  /* Admin DELETE */

  app.delete("/api/" + name + "/:id", adminOnly, (req, res) => {

    const data = read(file);

    const filtered = data.filter(
      item =>
        String(item.id) !== String(req.params.id)
    );

    write(file, filtered);

    res.json({
      message: "Item deleted successfully."
    });
  });
}

/* =========================
   EXISTING APIs
========================= */

crud(
  "resources",
  files.resources,
  ["type", "title", "url"]
);

crud(
  "announcements",
  files.announcements,
  ["title", "message"]
);

crud(
  "projects",
  files.projects,
  ["title", "description"]
);

crud(
  "calendar",
  files.calendar,
  ["title", "date"]
);

/* =========================
   NEW CAREER APIs
========================= */

crud(
  "communication",
  files.communication,
  ["category", "question"]
);

crud(
  "interviews",
  files.interviews,
  ["category", "question"]
);

crud(
  "technical",
  files.technical,
  ["category", "question"]
);

crud(
  "companies",
  files.companies,
  ["company", "preparation"]
);

crud(
  "jobs",
  files.jobs,
  ["company", "position"]
);

/* =========================
   HEALTH CHECK
========================= */

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "Engineering Student Portal is running."
  });
});

/* =========================
   FRONTEND
========================= */

app.get("*", (req, res) => {
  res.sendFile(
    path.join(publicDir, "index.html")
  );
});

/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {
  console.log(
    "Portal running on port " + PORT
  );
});
