# TalentFlow - Mini Hiring Platform

A modern React application for managing hiring workflows, built as a technical assignment. This platform enables HR teams to manage jobs, candidates, and assessments without a backend.

## 🚀 Features

### Jobs Board
- ✅ Create, edit, and archive jobs
- ✅ Pagination and filtering (by title, status, tags)
- ✅ Drag-and-drop reordering with optimistic updates
- ✅ Unique slug validation
- ✅ Deep linking to individual jobs

### Candidates Management
- ✅ Virtualized list handling 1000+ candidates
- ✅ Client-side search by name/email
- ✅ Stage filtering
- ✅ Kanban board for moving candidates between stages
- ✅ Drag-and-drop candidate stage transitions
- ✅ Timeline view for candidate progress
- ✅ Candidate detail pages with full history

### Assessments
- ✅ Job-specific assessment builder
- ✅ Multiple question types:
  - Single choice
  - Multiple choice
  - Short text
  - Long text
  - Numeric input
  - File upload (stub)
- ✅ Conditional questions
- ✅ Live preview of assessment forms
- ✅ Validation rules (required fields, max length, numeric ranges)

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router** for routing
- **TanStack Query (React Query)** for server state management
- **Zustand** for client state management
- **MSW (Mock Service Worker)** for API mocking
- **Dexie** for IndexedDB persistence
- **React DnD** for drag-and-drop
- **React Virtual** for virtualized lists
- **Faker.js** for data generation
- **Date-fns** for date formatting

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm

## 🔧 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd talentflow-hiring-platform
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── database/
│   ├── schema.ts           # Dexie database schema
│   └── seedData.ts         # Data seeding functions
├── mocks/
│   ├── handlers.ts         # MSW request handlers
│   └── browser.ts          # MSW worker setup
├── components/
│   ├── jobs/
│   │   ├── JobList.tsx
│   │   ├── JobCard.tsx
│   │   ├── JobForm.tsx
│   │   └── FilterBar.tsx
│   ├── candidates/
│   │   ├── CandidateKanban.tsx
│   │   ├── KanbanColumn.tsx
│   │   └── CandidateCard.tsx
│   ├── assessments/
│   │   └── AssessmentBuilder.tsx
│   └── ui/
│       ├── Button.tsx
│       └── Input.tsx
├── pages/
│   ├── JobsBoard.tsx
│   ├── JobDetail.tsx
│   ├── Candidates.tsx
│   ├── CandidateDetail.tsx
│   └── Assessments.tsx
├── App.tsx                 # Main app with routing
└── main.tsx               # Entry point
```

## 📊 Data Model

### Jobs
- Title (required, unique slug)
- Status (active/archived)
- Tags array
- Order number for drag-and-drop
- Created/updated timestamps

### Candidates
- Name, email, phone, LinkedIn
- Stage (applied → screen → tech → offer → hired/rejected)
- Associated job
- Timeline of stage changes and notes

### Assessments
- Job-specific
- Multiple sections with questions
- Question types with validation rules
- Conditional logic support

## 🔄 Architecture

### Data Flow
1. **MSW** intercepts API calls and simulates server behavior
2. **IndexedDB** (via Dexie) persists all data locally
3. **React Query** manages server state and caching
4. **Zustand** handles client-side state
5. On app load, seed data is generated if database is empty

### Mock API Features
- Random latency (200-1200ms)
- 5-10% error rate on write endpoints
- Pagination, filtering, and sorting
- Optimistic updates with rollback on reorder failures

### Persistence Strategy
- All data stored in IndexedDB
- MSW acts as "network layer" but writes through to IndexedDB
- App state restores from IndexedDB on refresh
- Real-time updates via React Query cache invalidation

## 🎨 UI/UX Features

- Modern, clean design with gradient branding
- Responsive layout for mobile and desktop
- Loading states and error handling
- Optimistic UI updates
- Smooth animations and transitions
- Accessible form controls

## 📝 API Endpoints

### Jobs
- `GET /api/jobs?search=&status=&page=&pageSize=&sort=`
- `POST /api/jobs`
- `PATCH /api/jobs/:id`
- `PATCH /api/jobs/:id/reorder`

### Candidates
- `GET /api/candidates?search=&stage=&page=`
- `POST /api/candidates`
- `PATCH /api/candidates/:id`
- `GET /api/candidates/:id/timeline`

### Assessments
- `GET /api/assessments/:jobId`
- `PUT /api/assessments/:jobId`
- `POST /api/assessments/:jobId/submit`

## 🧪 Testing

The application includes simulated network conditions:
- Latency variations (200-1200ms)
- Random errors (5-10% of write requests)
- Rollback mechanisms on reorder failures

## 🚢 Deployment

To build for production:

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service like:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 🎯 Future Enhancements

- Real backend integration
- Authentication and authorization
- Advanced candidate matching
- Email notifications
- Analytics dashboard
- Bulk operations
- Export functionality
- Multi-language support

## 📄 License

This project was created as a technical assignment.

## 👨‍💻 Development Notes

### Seed Data
The app automatically generates:
- 25 jobs (mixed active/archived)
- 1,000 candidates across all stages
- 3 sample assessments with 10+ questions each

### Performance Considerations
- Virtualized candidate lists for performance
- Optimistic updates for better UX
- React Query caching for reduced API calls
- IndexedDB for fast data access

### Technical Decisions
1. **No Real Backend**: MSW provides API simulation with realistic behaviors
2. **IndexedDB**: Chosen over localStorage for better performance and structured queries
3. **React Query**: Simplifies data fetching, caching, and state management
4. **Drag-and-Drop**: React DnD for intuitive candidate and job management
5. **Type Safety**: Full TypeScript coverage for better developer experience

