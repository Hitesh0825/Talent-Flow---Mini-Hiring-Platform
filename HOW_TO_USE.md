# How to Use TalentFlow

## Getting Started

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser** at `http://localhost:5173` (or the port shown in terminal)

## Adding Jobs

1. Click the **"+ New Job"** button on the Jobs Board
2. Fill in the job details:
   - Title (required)
   - Description
   - Location
   - Type (Full-time, Part-time, etc.)
   - Status (Active/Archived)
   - Tags

3. Click **"Create Job"**
4. Your job will be saved automatically in **localStorage**

## Adding Candidates

1. Go to the **Candidates** page (click "Candidates" in the sidebar)
2. Click the **"+ Add Candidate"** button
3. Fill in the candidate details:
   - Full Name (required)
   - Email (required)
   - Phone (optional)
   - LinkedIn (optional)
   - **Applied For** - Select the job they're applying for (required)

4. Click **"Add Candidate"**
5. The candidate will be saved and linked to the selected job

## Viewing Data in localStorage

To see your data stored in the browser:

1. Open **DevTools** (F12)
2. Go to the **Application** tab
3. Click **Local Storage** in the left sidebar
4. Click on `http://localhost:5173` (or your port)
5. You'll see these keys:
   - `talentflow_jobs` - All your jobs
   - `talentflow_candidates` - All your candidates
   - `talentflow_assessments` - All assessments
   - `talentflow_assessment_responses` - Assessment responses

6. Click on any key to see the JSON data

## Editing Data

### Jobs
- Click the ✏️ (edit) icon on any job card
- Make your changes
- Click "Update Job"

### Candidates
- Currently, candidates can be dragged between stages on the Kanban board
- Double-click to view full details

## Creating Assessments for Jobs

1. Go to the **Jobs Board**
2. Click on any job to view details
3. Scroll to the **Assessment** section
4. Click **"+ Create Assessment"** button
5. Fill in:
   - Assessment title
   - Description (optional)
6. Add sections:
   - Click **"+ Add Section"**
   - Give the section a name
   - Add questions to each section
7. For each question, select:
   - Question type (Single Choice, Multiple Choice, Short Text, etc.)
   - Question text
   - Options (for choice questions)
8. Click **"Save Assessment"**
9. The assessment will be linked to this job and saved

**Note:** Each job can have one assessment. The assessment builder provides a live preview as you create it.

## Managing Candidate Stages

Candidates can be in these stages:
- **Applied** - Initial application received
- **Screen** - In screening process
- **Tech** - Technical interview stage
- **Offer** - Offer extended
- **Hired** - Successfully hired
- **Rejected** - Application rejected

**Drag and drop** candidates between columns on the Kanban board to change their stage.

## Data Persistence

- All data is saved in **browser localStorage**
- Data persists across page refreshes
- Data is specific to this browser/device
- No backend server required

## Exporting Data

To export your data:

1. Open DevTools → Application → Local Storage
2. Click on a key (e.g., `talentflow_jobs`)
3. Copy the JSON data
4. Paste it into a text file and save as `.json`

## Notes

- **No sample data** - Start with an empty database
- **Only manual entry** - You must create jobs and candidates yourself
- **Local storage only** - Data stays in your browser unless you export it
- **Drag and drop** - Reorder jobs by dragging cards
- **Kanban board** - Move candidates between recruitment stages

