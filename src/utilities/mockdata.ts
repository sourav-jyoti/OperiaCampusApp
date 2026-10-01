import type { Assignment, BannerNotice, Student, Tiles, TimeTable } from './types';

export const tilesData: Tiles[] = [
  // Administration
  { category: 'Administration', title: 'Leave', icon: 'CalendarOff', badge: '1', path: '/(Tiles)/LeaveRequest' },
  { category: 'Administration', title: 'Duties', icon: 'ClipboardCheck', badge: '1', path: '/(Tiles)/Duties' },
  { category: 'Administration', title: 'Events', icon: 'CalendarDays', badge: '2', path: '/(Tiles)/Events' },
  { category: 'Administration', title: 'Meetings', icon: 'Users', badge: '1', path: '/(Tiles)/Meetings' },
  // Academics
  { category: 'Academics', title: 'Assignments', icon: 'FileText', badge: '3', path: '/(Tiles)/Assignments' },
  { category: 'Academics', title: 'Subjects', icon: 'BookOpen', badge: '', path: '/(Tiles)/Subjects' },
  { category: 'Academics', title: 'Study Material', icon: 'BookMarked', badge: '', path: '/(Tiles)/StudyMaterial' },
  // Students
  { category: 'students', title: 'Student Profile', icon: 'UserRound', badge: '', path: '/(Tiles)/StudentProfile' },
  { category: 'students', title: 'Attendance', icon: 'CalendarCheck', badge: '', path: '/(Tiles)/MarkAttendance' },
  { category: 'students', title: 'Student Review', icon: 'BarChart3', badge: '', path: '/(Tiles)/StudentReview' },
  // Examination
  { category: 'Examination', title: 'Create Exam', icon: 'FilePlus', badge: '', path: '/(Tiles)/CreateExam' },
  { category: 'Examination', title: 'Upload Marks', icon: 'Upload', badge: '', path: '/(Tiles)/UploadMarks' },
  { category: 'Examination', title: 'Results', icon: 'ChartColumn', badge: '', path: '/(Tiles)/GenerateReport' },
  // Timetable
  { category: 'Timetable', title: 'View Timetable', icon: 'Calendar', badge: '', path: '/(Tiles)/ViewTimetable' },
  { category: 'Timetable', title: 'Manage Timetable', icon: 'CalendarCog', badge: '', path: '/(Tiles)/ManageTimetable' },
  { category: 'Timetable', title: 'Class Routine', icon: 'Clock', badge: '', path: '/(Tiles)/ClassRoutine' },
  { category: 'Timetable', title: 'Room Allocation', icon: 'DoorOpen', badge: '', path: '/(Tiles)/RoomAllocation' },
  // AI Assistant
  { category: 'AI Assistant', title: 'AI Chat Bot', icon: 'Bot', badge: 'AI', path: '/(Tiles)/AIChatBot' },
];

export const timetableData: TimeTable[] = [
  {
    day: 'Monday',
    date: '11 june, 26',
    schedule: [
      { subject: 'Math', startTime: '9:00 AM', endTime: '10:00 AM', Period: '1', class: 'VI C' },
      { subject: 'Science', startTime: '10:00 AM', endTime: '11:00 AM', Period: '2', class: 'VII A ' },
      { subject: 'SST.', startTime: '11:00 AM', endTime: '11:30 AM', Period: '3', class: 'V C' },
      { subject: 'Lang.', startTime: '11:30 AM', endTime: '12:00 PM', Period: '4', class: 'VII B' },
      { subject: 'Comp sci.', startTime: '12:00 PM', endTime: '12:30 PM', Period: '5', class: 'IV C' },
      { subject: 'Play ', startTime: '12:30 PM', endTime: '1:00 PM', Period: '6', class: 'I C' },
    ],
  },
];

export const bannerNotice: BannerNotice[] = [
  {
    title: 'Fee due',
    description: 'Your fee payment is pending . Please complete it by 15 nov .',
    path: '',
    pathname: 'Pay now',
    Color: { Border: '#e88636ff', Button: '#fa7d50ff', Background: '#f9e0ccff' },
  },
  {
    title: 'Result',
    description: 'Your exam result is published',
    path: '',
    pathname: 'view result',
    Color: { Border: '#1084e9ff', Button: '#1d58edff', Background: '#cfdcfdff' },
  },
];

export const mockStudents: Student[] = [
  { id: '1', name: 'Aarav Sharma', rollNo: 'CSE-001', gender: 'male' },
  { id: '2', name: 'Ananya Iyer', rollNo: 'CSE-002', gender: 'female' },
  { id: '3', name: 'Devansh Verma', rollNo: 'CSE-003', gender: 'male' },
  { id: '4', name: 'Ishita Patel', rollNo: 'CSE-004', gender: 'female' },
  { id: '5', name: 'Kabir Mukherjee', rollNo: 'CSE-005', gender: 'male' },
  { id: '6', name: 'Meera Nair', rollNo: 'CSE-006', gender: 'female' },
  { id: '7', name: 'Rohan Gupta', rollNo: 'CSE-007', gender: 'male' },
  { id: '8', name: 'Saanvi Kulkarni', rollNo: 'CSE-008', gender: 'female' },
  { id: '9', name: 'Vihaan Reddy', rollNo: 'CSE-009', gender: 'male' },
  { id: '10', name: 'Zoya Khan', rollNo: 'CSE-010', gender: 'female' },
];

export const mockAssignments: Assignment[] = [
  {
    id: 'asg-1',
    subject: 'Science',
    title: 'Light Reflection and Refraction Lab',
    dueDate: '5th Jul 2026',
    fileType: 'doc',
    fileName: 'science_optics_lab_v2.docx',
    status: 'pending',
    totalMarks: 25,
  },
  {
    id: 'asg-2',
    subject: 'Mathematics',
    title: 'Linear Equations & Matrices Exercise',
    dueDate: '8th Jul 2026',
    fileType: 'pdf',
    fileName: 'matrices_worksheet_ch4.pdf',
    status: 'pending',
    totalMarks: 30,
  },
  {
    id: 'asg-3',
    subject: 'Computer Science',
    title: 'Data Structures: Binary Search Tree',
    dueDate: '10th Jul 2026',
    fileType: 'doc',
    fileName: 'bst_assignment_specs.docx',
    status: 'pending',
    totalMarks: 50,
  },
  {
    id: 'asg-4',
    subject: 'English',
    title: 'Essay on Climate Change Impact',
    dueDate: '12th Jul 2026',
    fileType: 'doc',
    fileName: 'essay_guidelines_topic3.docx',
    status: 'submitted',
    submittedAt: '3rd Jul 2026',
    totalMarks: 20,
  },
  {
    id: 'asg-5',
    subject: 'Science',
    title: 'Acids, Bases and Salts Report',
    dueDate: '15th Jul 2026',
    fileType: 'pdf',
    fileName: 'chemistry_acid_base_practical.pdf',
    status: 'pending',
    totalMarks: 20,
  },
  {
    id: 'asg-6',
    subject: 'Social Studies',
    title: 'Industrial Revolution Timeline & Maps',
    dueDate: '18th Jul 2026',
    fileType: 'ppt',
    fileName: 'industrial_revolution_project.pptx',
    status: 'pending',
    totalMarks: 35,
  },
];
