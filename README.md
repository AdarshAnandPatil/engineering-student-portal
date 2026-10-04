# Engineering Student Portal

A modern, responsive Engineering Student Portal for academics, technical skills, placement preparation, interview practice, projects, courses and daily practice.

## Main dashboard
The Home/Dashboard is intentionally the strongest visual design in the portal because it is the first screen students see. It includes:
- Hero section with **Learn • Practice • Build • Prepare**
- Creator attribution: **Created by Adarsh Anand Patil**
- Live portal statistics from the JSON data
- Colorful feature cards for every major section
- Responsive mobile navigation
- Mixed purple, green, orange, pink, teal and yellow visual system
- Hover effects, gradients, shadows, rounded cards and subtle animations

## Student sections
- Home / Dashboard
- E-Library
- Results + official VTU Results link
- Placements & Internships
  - Placement Hub
  - Previous Placement Questions
  - Job Alerts (jobs + internships)
  - Job/internship platform links
- Technical Skills & Resources
- Aptitude
- Communication & English
- Interview Preparation
  - 240 interview questions across HR, Java, Python, SQL, DSA, DBMS, OOP, OS, CN, Project, Technical and Coding categories
  - Voice/text practice
  - I Don't Know mode
  - AI Mock Interview inside Interview Preparation
- Job Preparation Roadmap
- Free Courses & Certifications
- Resume Builder
- Project Ideas
- Daily Practice (Aptitude, Technical, Communication & English, Interview)
- Announcements
- Academic Calendar
- Useful Links

Standalone **AI Career Mentor**, **Company Preparation**, and **Placement Experiences** sections are not included.

## Placement question bank
- 58 companies
- 4,176 company-specific practice entries (58 companies × 6 categories × 12 questions)
- Company-wise question-bank UI
- Aptitude, Coding, Technical, SQL, HR and Interview categories
- Answers and explanations
- Company-focused practice entries are clearly described as practice unless a source is explicitly identified; students should verify current hiring patterns on official company sources.

## Free Courses & Certifications
The course catalogue uses only these seven requested platforms:
1. Official VTU Online
2. freeCodeCamp
3. Microsoft Learn
4. AWS Skill Builder
5. IBM SkillsBuild
6. SoloLearn
7. Simplilearn

Individual course access and certificate/credential rules can vary by course, so the portal labels these as course-dependent where appropriate.

## Technical resources
Supported skills include C/C++, Java, Python, JavaScript, HTML/CSS, SQL, DSA, DBMS, OS, CN, OOP, Web Development, AI/ML, Cloud, Cybersecurity and Embedded/VLSI.

Admin can add, edit, delete and publish resources. PDF and URL resources are supported.

## Navigation
The portal uses in-app history so a detail page's **Back** action returns to the immediate previous portal page. The Dashboard is a separate explicit action.

The internal Back stack now stores the exact nested view, not only the top-level section.

Examples:
- Placement Hub → Previous Placement Questions → Back → Placement Hub
- Previous Questions → Company → Back → Previous Questions
- Technical Skills → Java → Back → Technical Skills
- Roadmap → Python Full Stack → Back → Roadmap
- Courses → Back → Courses

## Run locally
```bash
npm start
```
Then open `http://localhost:3000`.

Node.js 18+ is recommended.

## Admin
Default demo credentials:
- Email: `admin@college.com`
- Password: `admin123`

Admin sessions are stored in memory on the server and are not JWT sessions.

## Deploy to Render
Use a Web Service with:
- Build Command: `npm install`
- Start Command: `npm start`
- Environment: Node

The app is intentionally dependency-light and uses a Node.js HTTP server with JSON files for content.


## Results
Each student enters their own Semester 1–8 SGPA and total semester credits. The portal calculates the student's credit-weighted CGPA and displays a CGPA×10 percentage reference. Entries are stored in that browser's local storage; Admin does not enter student results. The official VTU Results website is linked directly.
