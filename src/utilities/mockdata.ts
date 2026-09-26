import type { BannerNotice, Tiles, TimeTable } from './types';

export const tilesData: Tiles[] = [
  { category: 'Administration', title: 'Leave', icon: 'leaveRequest', badge: '1', path: '' },
  { category: 'Administration', title: 'Duties', icon: 'duties', badge: '1', path: '' },
  { category: 'Administration', title: 'Events', icon: 'event', badge: '2', path: '' },
  { category: 'Administration', title: 'Meetings', icon: 'meetings', badge: '1', path: '' },
  { category: 'Academics', title: 'Assignments', icon: 'assignment', badge: '', path: '' },
  { category: 'Academics', title: 'Subjects', icon: 'subject', badge: '', path: '' },
  { category: 'Academics', title: 'Study Material', icon: 'study', badge: '', path: '' },
  { category: 'students', title: 'Student Profile', icon: 'profile', badge: '', path: '' },
  { category: 'students', title: 'Attendance', icon: 'attendance', badge: '', path: '' },
  { category: 'students', title: 'Student Review', icon: 'review', badge: '', path: '' },
  { category: 'Examination', title: 'Create Exam', icon: '', badge: '', path: '' },
  { category: 'Examination', title: 'Upload Marks', icon: '', badge: '', path: '' },
  { category: 'Examination', title: 'Results', icon: 'result', badge: '', path: '' },
  { category: 'Timetable', title: 'My Timetable', icon: 'timetable', badge: '', path: '' },
  { category: 'Timetable', title: 'Substitution', icon: 'substition', badge: '', path: '' },
  { category: 'Timetable', title: 'Schedule Requests', icon: 'scheduleRequest', badge: '', path: '' },
  { category: 'Miscellaneous', title: 'Library', icon: 'library', badge: '', path: '' },
  { category: 'Miscellaneous', title: 'Student Feedback', icon: 'studentFeedback', badge: '3', path: '' },
];

// const tileImages: Record<string, any> = {
//     salary: require("../../../assets/myassets/fee.png"),
//     attendance: require("../../../assets/myassets/attendance.png"),
//     assignment: require("../../../assets/myassets/assignment.png"),
//     result: require("../../../assets/myassets/result.png"),
//     event: require("../../../assets/myassets/event.png"),
//     place_holder: require("../../../assets/myassets/place_holder.png"),
// };

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
