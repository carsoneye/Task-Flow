import { Task } from "@/types/task";

// Helper function to create dates relative to now
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);
const twoWeeksAgo = new Date(today);
twoWeeksAgo.setDate(today.getDate() - 14);

export const sampleTasks: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // === HIGH PRIORITY WORK TASKS ===
  {
    title: "Prepare Q4 Board Presentation",
    description: "Create comprehensive presentation covering revenue growth, market expansion, and strategic initiatives for the quarterly board meeting. Include financial projections and competitive analysis.",
    completed: false,
    status: "in-progress",
    priority: "high",
    category: "work",
    dueDate: tomorrow,
    estimatedMinutes: 180,
    actualMinutes: 45,
    tags: ["presentation", "board", "quarterly", "urgent"],
    mentions: ["@sarah", "@mike"],
    focusSession: true,
    creationMode: "detailed",
  },
  {
    title: "Fix Critical Security Bug",
    description: "Address authentication vulnerability in user login system. High priority security issue affecting all users.",
    completed: false,
    status: "pending",
    priority: "high",
    category: "work",
    dueDate: today,
    estimatedMinutes: 120,
    tags: ["security", "bug", "critical", "authentication"],
    mentions: ["@dev-team"],
    focusSession: true,
    creationMode: "detailed",
  },
  {
    title: "Client Demo Preparation",
    description: "Prepare demo environment and presentation for major client meeting. Showcase new features and integration capabilities.",
    completed: false,
    status: "pending",
    priority: "high",
    category: "work",
    dueDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
    estimatedMinutes: 90,
    tags: ["demo", "client", "presentation"],
    mentions: ["@sales-team"],
    focusSession: true,
    creationMode: "detailed",
  },

  // === MEDIUM PRIORITY WORK TASKS ===
  {
    title: "Code Review - User Dashboard",
    description: "Review pull request #247 for the new user dashboard component. Check for accessibility compliance and performance optimizations.",
    completed: false,
    status: "in-progress",
    priority: "medium",
    category: "work",
    dueDate: tomorrow,
    estimatedMinutes: 60,
    actualMinutes: 20,
    tags: ["code-review", "dashboard", "accessibility"],
    mentions: ["@alex"],
    creationMode: "detailed",
  },
  {
    title: "Update API Documentation",
    description: "Document new REST API endpoints and update Swagger specifications for version 2.1 release.",
    completed: false,
    status: "pending",
    priority: "medium",
    category: "work",
    dueDate: nextWeek,
    estimatedMinutes: 75,
    tags: ["documentation", "api", "swagger"],
    creationMode: "detailed",
  },
  {
    title: "Team Standup Meeting",
    description: "Daily standup with development team to discuss progress, blockers, and upcoming tasks.",
    completed: true,
    status: "completed",
    priority: "medium",
    category: "work",
    dueDate: today,
    completedAt: new Date(today.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
    estimatedMinutes: 30,
    actualMinutes: 25,
    tags: ["meeting", "standup", "team"],
    creationMode: "quick",
  },

  // === PERSONAL TASKS ===
  {
    title: "Grocery Shopping",
    description: "Weekly grocery run - need milk, bread, eggs, vegetables, and ingredients for weekend cooking.",
    completed: false,
    status: "pending",
    priority: "medium",
    category: "personal",
    dueDate: today,
    estimatedMinutes: 45,
    tags: ["shopping", "weekly", "food"],
    creationMode: "quick",
  },
  {
    title: "Book Vacation Rental",
    description: "Research and book vacation rental for summer trip to Costa Rica. Need 2-bedroom place near beach with good reviews.",
    completed: false,
    status: "pending",
    priority: "low",
    category: "personal",
    dueDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
    estimatedMinutes: 60,
    tags: ["vacation", "travel", "booking"],
    creationMode: "detailed",
  },
  {
    title: "Call Mom",
    completed: false,
    status: "pending",
    priority: "medium",
    category: "personal",
    dueDate: tomorrow,
    estimatedMinutes: 20,
    creationMode: "quick",
  },
  {
    title: "Water Plants",
    completed: false,
    status: "pending",
    priority: "low",
    category: "personal",
    dueDate: today,
    estimatedMinutes: 10,
    creationMode: "quick",
  },
  {
    title: "Take Out Trash",
    completed: true,
    status: "completed",
    priority: "low",
    category: "personal",
    dueDate: today,
    completedAt: new Date(today.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
    estimatedMinutes: 5,
    actualMinutes: 5,
    creationMode: "quick",
  },

  // === HEALTH TASKS ===
  {
    title: "Morning Workout",
    description: "45-minute strength training session at the gym. Focus on upper body and core exercises.",
    completed: true,
    status: "completed",
    priority: "medium",
    category: "health",
    dueDate: today,
    completedAt: new Date(today.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
    estimatedMinutes: 45,
    actualMinutes: 50,
    tags: ["exercise", "gym", "strength"],
    creationMode: "detailed",
  },
  {
    title: "Dentist Appointment",
    description: "Annual dental checkup and cleaning. Need to confirm appointment time and location.",
    completed: false,
    status: "pending",
    priority: "medium",
    category: "health",
    dueDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days
    estimatedMinutes: 60,
    tags: ["appointment", "dental", "health"],
    creationMode: "quick",
  },
  {
    title: "Meal Prep for Week",
    description: "Prepare healthy meals for the upcoming week. Focus on protein-rich dishes and vegetables.",
    completed: false,
    status: "pending",
    priority: "low",
    category: "health",
    dueDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
    estimatedMinutes: 90,
    tags: ["meal-prep", "cooking", "healthy"],
    creationMode: "detailed",
  },

  // === OVERDUE TASKS ===
  {
    title: "Submit Expense Report",
    description: "Submit Q3 expense report with receipts and documentation. Overdue by 3 days.",
    completed: false,
    status: "pending",
    priority: "high",
    category: "work",
    dueDate: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    estimatedMinutes: 30,
    tags: ["expenses", "finance", "overdue"],
    creationMode: "quick",
  },
  {
    title: "Renew Car Insurance",
    description: "Car insurance expires next week. Need to compare rates and renew policy.",
    completed: false,
    status: "pending",
    priority: "high",
    category: "personal",
    dueDate: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000), // Yesterday
    estimatedMinutes: 45,
    tags: ["insurance", "car", "renewal"],
    creationMode: "detailed",
  },

  // === COMPLETED TASKS (for stats) ===
  {
    title: "Learn React Hooks",
    description: "Complete online course on advanced React hooks and patterns. Build practice projects.",
    completed: true,
    status: "completed",
    priority: "low",
    category: "work",
    dueDate: yesterday,
    completedAt: yesterday,
    estimatedMinutes: 120,
    actualMinutes: 135,
    tags: ["learning", "react", "development"],
    focusSession: true,
    creationMode: "detailed",
  },
  {
    title: "Organize Home Office",
    description: "Clean and organize home office workspace. Sort files, declutter desk, and optimize setup.",
    completed: true,
    status: "completed",
    priority: "low",
    category: "personal",
    dueDate: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    completedAt: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    estimatedMinutes: 60,
    actualMinutes: 75,
    tags: ["organization", "home", "office"],
    creationMode: "detailed",
  },
  {
    title: "Schedule Annual Physical",
    description: "Book annual physical exam with primary care physician. Check availability for next month.",
    completed: true,
    status: "completed",
    priority: "medium",
    category: "health",
    dueDate: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    completedAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    estimatedMinutes: 15,
    actualMinutes: 10,
    tags: ["appointment", "health", "annual"],
    creationMode: "quick",
  },

  // === SIMPLE TASKS (no description, no tags) ===
  {
    title: "Check Email",
    completed: false,
    status: "pending",
    priority: "medium",
    category: "work",
    dueDate: new Date(today.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
    estimatedMinutes: 20,
    creationMode: "quick",
  },
  {
    title: "Walk the Dog",
    completed: false,
    status: "pending",
    priority: "high",
    category: "personal",
    dueDate: new Date(today.getTime() + 1 * 60 * 60 * 1000), // 1 hour from now
    estimatedMinutes: 30,
    creationMode: "quick",
  },
  {
    title: "Pick Up Dry Cleaning",
    completed: false,
    status: "pending",
    priority: "low",
    category: "personal",
    dueDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days
    estimatedMinutes: 15,
    creationMode: "quick",
  },
  {
    title: "Update LinkedIn Profile",
    completed: true,
    status: "completed",
    priority: "low",
    category: "work",
    dueDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    completedAt: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    estimatedMinutes: 25,
    actualMinutes: 20,
    creationMode: "quick",
  },
  {
    title: "Buy Birthday Gift",
    completed: false,
    status: "pending",
    priority: "medium",
    category: "personal",
    dueDate: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000), // 4 days
    estimatedMinutes: 30,
    creationMode: "quick",
  },

  // === RECURRING TASKS ===
  {
    title: "Weekly Team Sync",
    description: "Weekly team synchronization meeting to discuss project status and upcoming milestones.",
    completed: false,
    status: "pending",
    priority: "medium",
    category: "work",
    dueDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days
    estimatedMinutes: 45,
    tags: ["meeting", "weekly", "team"],
    isRecurring: true,
    recurringPattern: {
      type: "weekly",
      interval: 1,
      daysOfWeek: [1, 3, 5], // Monday, Wednesday, Friday
    },
    creationMode: "detailed",
  },
  {
    title: "Grocery Shopping",
    description: "Weekly grocery shopping for household essentials and meal planning ingredients.",
    completed: false,
    status: "pending",
    priority: "medium",
    category: "personal",
    dueDate: new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000), // 6 days
    estimatedMinutes: 60,
    tags: ["shopping", "weekly", "household"],
    isRecurring: true,
    recurringPattern: {
      type: "weekly",
      interval: 1,
      daysOfWeek: [6], // Saturday
    },
    creationMode: "detailed",
  },

  // === FOCUS SESSION TASKS ===
  {
    title: "Deep Work - Algorithm Optimization",
    description: "Focus session to optimize critical pathfinding algorithm. Need 2+ hours of uninterrupted time.",
    completed: false,
    status: "pending",
    priority: "high",
    category: "work",
    dueDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
    estimatedMinutes: 150,
    tags: ["algorithm", "optimization", "deep-work"],
    focusSession: true,
    creationMode: "detailed",
  },
  {
    title: "Write Technical Blog Post",
    description: "Write comprehensive blog post about microservices architecture patterns and best practices.",
    completed: false,
    status: "in-progress",
    priority: "medium",
    category: "work",
    dueDate: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000), // 4 days
    estimatedMinutes: 120,
    actualMinutes: 30,
    tags: ["writing", "blog", "technical"],
    focusSession: true,
    creationMode: "detailed",
  },
];
