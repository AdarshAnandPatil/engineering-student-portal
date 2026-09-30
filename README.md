# Engineering Student Portal — Final Build v3.0

## Included from the requested portal plan
- Dashboard
- E-Library with course-wise Apna College YouTube lecture searches
- SGPA/CGPA calculator
- Combined **Placements & Internships** hub (no separate Internship Opportunities page)
- Company directory with tier grouping, official career links and preparation roadmap
- Job boards: LinkedIn, Internshala, Naukri, Indeed, Foundit, Unstop, Wellfound, Glassdoor, Freshersworld, Apna, Cutshort
- Application tracker: Saved → Applied → Assessment → Interview → Offer → Closed
- Placement Experiences: candidate-reported/publicly documented references with verification-status wording; the portal never falsely labels a community report as an official company paper. Admin can verify evidence before changing status.
- Previous Placement Questions Bank: company → year → role → round → question → answer → explanation → resource link
- Resume Builder
- Technical Skills & Resources; no separate Courses subpart; admin resource slots for PDFs/notes/videos/links
- Daily Practice with topic selection and **I Don't Know / Reveal Answer** flow
- AI Career Mentor with company/role practice and answer reveal
- Announcements and Calendar
- Project Ideas renamed/structured as **Project-Specific Tutorial + Relevant Project References**
- 30+ real-world projects across AI/ML, Web/Software, Data/Analytics, Cloud/DevOps, Cybersecurity, IoT/Embedded and Industry/Engineering
- Project fields: difficulty, problem, real-world use, technologies, modules, features, database/API, AI/ML, tutorials, external/open-source references, datasets/APIs, deployment, testing/security and interview questions
- Personal GitHub/Render links, personal name and the personal AI Patient Gesture project are excluded from Project Ideas
- Useful Links
- Admin/Creator content area and JSON content API
- Responsive mixed-color UI; no blue-heavy theme

## Verification note
Placement experiences and interview questions are explicitly presented as candidate-reported/public preparation material. They are not claimed to be confidential or official company papers. Current eligibility, process, questions and deadlines must be checked against the relevant official company/job-board source.

## Run
```bash
npm start
```
Then open `http://localhost:3000`.

No npm dependency installation is required.

## Admin API
GET `/api/content` reads `data/content.json`.
POST `/api/content` accepts JSON when header `x-admin-key` matches `ADMIN_KEY`; local default is `admin123`. Change it before production deployment.
