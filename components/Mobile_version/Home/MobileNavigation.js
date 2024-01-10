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
  Camera,
  CheckCircle,
} from "react-feather";

export const navigationData = [
  {
    id: "myTask",
    title: "My Task",
    icon: <File size={24} />,
    href: "/hsse/mobile/my-task",
    roles: [
      "HSSE-SU",
      "HSSE-SYSADMIN",
      "HSSE-INSP",
      "HSSE-INSP-SUP",
      "HSSE-MAN",
      "HSSE-PIC-CAPA",
    ],
  },
  {
    id: "inspeksi",
    title: "INSPEKSI",
    icon: <CheckCircle size={24} />,
    href: "/hsse/mobile/inspection",
    roles: [
      "HSSE-SU",
      "HSSE-INSP",
      "HSSE-INSP-SUP",
      "HSSE-PIC-CAPA",
    ],
  },
  {
    id: "pengaduan",
    title: "PENGADUAN",
    icon: <File size={24} />,
    href: "/hsse/mobile/pengaduan",
    roles: [
      "HSSE-SU",
      "HSSE-SYSADMIN",
      "HSSE-INSP",
      "HSSE-INSP-SUP",
      "HSSE-MAN",
      "HSSE-PIC-CAPA",
      "HSSE-USR",
    ],
  },
  {
    id: "pendingInspeksi",
    title: "Pending",
    icon: <AlertTriangle size={24} />,
    href: "/hsse/mobile/qr-code",
    roles: [
      "HSSE-SU",
      "HSSE-SYSADMIN",
      "HSSE-INSP",
      "HSSE-INSP-SUP",
      "HSSE-MAN",
      "HSSE-PIC-CAPA",
    ],
  },
  {
    id: "scanqr",
    title: "SCAN QR",
    icon: <Camera size={24} />,
    href: "/hsse/mobile/qr-code",
    roles: [
      "HSSE-SU",
      "HSSE-SYSADMIN",
      "HSSE-INSP",
      "HSSE-INSP-SUP",
      "HSSE-MAN",
      "HSSE-PIC-CAPA",
      "HSSE-USR",
    ],
  },
  {
    id: "inven",
    title: "INVENTORY",
    icon: <Box size={24} />,
    href: "/hsse/mobile/inventory",
    roles: [
      "HSSE-SU",
      "HSSE-SYSADMIN",
      "HSSE-INSP",
      "HSSE-INSP-SUP",
    ],
  },
];
