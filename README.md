# TaskFlow - Modern Task Management Application

A comprehensive, modern task management application built with Next.js 15, React 19, TypeScript, and Tailwind CSS. Features a clean, responsive design with advanced state management, multiple view modes, and a dashboard-driven interface.

## 🚀 Features

### Core Task Management
- **Complete CRUD Operations**: Create, read, update, and delete tasks
- **Advanced Task Properties**: Title, description, priority, category, due dates, tags
- **Status Tracking**: Pending, in-progress, completed, cancelled
- **Priority Levels**: Low, medium, high with color-coded indicators
- **Categories**: Work, personal, health, other

### Multiple View Modes
- **List View**: Full details with vertical layout
- **Grid View**: Card-based, responsive 3-column layout
- **Compact View**: Minimal details, horizontal layout

### Dashboard System
- **Stats Widget**: Task counts and completion rates
- **Today's Focus**: Tasks due today with priority indicators
- **Quick Actions**: Add task, command bar access, view all tasks
- **Simple Tasks**: Clean list of title-only tasks, sorted by recently added
- **Completed Tasks**: Completion statistics and recent achievements

### Advanced Features
- **Smart Filtering**: Category, priority, status, date ranges, overdue tasks
- **Comprehensive Sorting**: 8 sorting options (newest, oldest, due soon, priority, alphabetical)
- **Search Functionality**: Full-text search across titles, descriptions, and tags
- **Command Bar**: Universal search and quick actions (⌘K)
- **Theme System**: Light and dark mode with modern blue-orange design
- **Responsive Design**: Seamless experience across all device sizes
- **Data Persistence**: Local storage with automatic saving and error handling

### User Experience
- **Hold-to-Delete**: 3-second hold with countdown for task deletion
- **Context-Aware Editing**: Tasks open in their creation mode (quick/detailed)
- **Consistent Design**: Unified design language throughout
- **Loading States**: Skeleton components and smooth transitions
- **Empty States**: Helpful, consistent empty state designs

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.3 with Turbopack
- **Frontend**: React 19.1.0 with TypeScript 5
- **Styling**: Tailwind CSS 3.4 with HSL color system
- **UI Components**: Shadcn UI (Radix UI primitives)
- **State Management**: React Context API with useReducer
- **Theme**: next-themes for light/dark mode
- **Icons**: Lucide React
- **Date Handling**: date-fns and react-day-picker
- **Storage**: Local Storage with data migration

## 🎨 Design System

### Color Palette
- **Primary**: Modern orange (`hsl(24.58, 94.98%, 53.14%)`)
- **Background**: Light gray / Dark blue theme
- **Status Colors**: 
  - Blue (completed): `hsl(217, 91%, 60%)`
  - Orange (today): `hsl(25, 95%, 53%)`
  - Yellow (in-progress): `hsl(45, 93%, 47%)`
  - Red (overdue): `hsl(0, 84%, 60%)`

### Typography
- **Sans**: Poppins (headings and UI)
- **Serif**: Lora (body text)
- **Mono**: Fira Code (code and data)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/carsoneye/Task-Flow.git
cd Task-Flow
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css              # Global styles & CSS variables
│   ├── layout.tsx               # Root layout with theme provider
│   └── page.tsx                 # Main entry point
├── components/
│   ├── ui/                      # Shadcn UI components
│   ├── widgets/                 # Dashboard widgets
│   ├── skeletons/               # Loading skeleton components
│   ├── task-*.tsx              # Task-related components
│   ├── navigation.tsx           # Main navigation
│   ├── dashboard.tsx            # Dashboard page
│   └── app-content-new.tsx      # Main app content router
├── context/
│   └── task-context.tsx         # Global state management
├── lib/
│   ├── utils.ts                 # Utility functions
│   ├── storage.ts               # Local storage management
│   └── colors.ts                # Color system definitions
├── types/
│   └── task.ts                  # TypeScript type definitions
└── data/
    └── sample-tasks.ts          # Sample task data
```

## 🎯 Key Features in Detail

### Task Management
- **Natural Language Input**: Smart task creation with auto-detection
- **Priority System**: Visual priority indicators with color coding
- **Due Date Management**: Flexible due date setting with overdue detection
- **Category Organization**: Work, personal, health, and other categories
- **Tag System**: Flexible tagging for better organization

### Dashboard Widgets
- **Stats Overview**: Total, pending, completed, and overdue task counts
- **Today's Focus**: Priority tasks due today
- **Quick Actions**: Fast access to common actions
- **Simple Tasks**: Clean list of title-only tasks
- **Completed Tasks**: Recent completion statistics

### View Modes
- **List View**: Detailed vertical layout with all task information
- **Grid View**: Card-based layout with responsive columns
- **Compact View**: Minimal horizontal layout for quick scanning

### Filtering & Sorting
- **Smart Filters**: Category, priority, status, date ranges
- **Advanced Sorting**: 8 different sorting options
- **Search**: Full-text search across all task content
- **Date Filters**: Today, this week, overdue, custom ranges

## 🔧 State Management

The application uses React Context API with useReducer for state management:

- **Task State**: Tasks, filters, view modes, settings
- **Local Storage**: Automatic persistence with error handling
- **Data Migration**: Schema versioning for backward compatibility
- **Error Recovery**: Graceful fallbacks for corrupted data

## 📱 Responsive Design

- **Mobile**: < 768px (1 column layout)
- **Tablet**: 768px - 1024px (2 column layout)
- **Desktop**: > 1024px (3+ column layout)

## 🎨 Customization

The design system is fully customizable through CSS variables:

- **Color Themes**: Easy color customization
- **Typography**: Configurable font families
- **Spacing**: Consistent spacing scale
- **Components**: Reusable component variants

## 📊 Performance

- **Bundle Size**: ~196KB (optimized)
- **Build Time**: ~2-3 seconds
- **Initial Load**: < 2 seconds
- **Navigation**: < 100ms
- **Task Operations**: < 50ms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Shadcn UI](https://ui.shadcn.com/) - Component library
- [Radix UI](https://www.radix-ui.com/) - Primitive components
- [Lucide React](https://lucide.dev/) - Icon library

---

**TaskFlow** - Modern task management made simple and beautiful.