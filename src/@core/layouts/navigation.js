import {
  Circle,
  Grid,
  Home,
  Users,
  File,
  Map,
  MapPin,
  User,
  Box,
  List,
  HelpCircle,
  Paperclip,
  AlertTriangle,
  Compass,
  PlusSquare,
  FileText,
  DollarSign
} from "react-feather";

export const navigationData = [
  {
    id: "home",
    title: "Home",
    icon: <Home size={24} />,
    href: "/home",
    roles: ["MENTOR", "HR", "ADMIN"],
  },
  {
    id: "internshipAttendance",
    title: "Internship Logbook",
    icon: <List size={24} />,
    href: "/internship",
    roles: ["MENTOR", "HR", "ADMIN"],
  },
  {
    id: "master",
    title: "Master",
    icon: <Grid size={24} />,
    roles: ["MENTOR", "HR", "ADMIN"],
    children: [
      {
        id: "intern",
        title: "Master Intern",
        icon: <Users size={24} />,
        roles: ["MENTOR", "HR", "ADMIN"],
        href: "/master/intern",
      },
      {
        id: "user",
        title: "Master User",
        icon: <Users size={24} />,
        roles: ["MENTOR", "HR", "ADMIN"],
        href: "/master/user",
      },
      {
        id: "allowance",
        title: "Master Allowance",
        icon: <DollarSign size={24} />,
        roles: ["MENTOR", "HR", "ADMIN"],
        href: "/master/allowance",
      }
    ],
  },
];
