// types/api.ts
export interface ApiResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface Account {
  AccountID: string;
  Email: string;
  PasswordHash: string;
  PhoneNumber: string;
  FullName: string;
  AvatarURL?: string;
  Role: "Renter" | "Staff" | "Admin";
  Status: "Active" | "Inactive" | "Locked" | "Pending";
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  token: string;
  user: {
    AccountID: string;
    Email: string;
    FullName: string;
    Role: "Renter" | "Staff" | "Admin";
    StaffID?: string;
  };
}

export interface Renter {
  RenterID: string;
  Address: string | null;
  DateOfBirth: string | null;
  IdentityNumber: string | null;
  FrontIdentityImageUrl: string | null;
  BackIdentityImageUrl: string | null;
  Account: {
    AccountID: string;
    FullName: string;
    Email: string;
    PhoneNumber: string;
    Status: "Active" | "Inactive" | "Pending";
  };
}

export interface Vehicle {
  VehicleID: string;
  LicensePlate: string;
  Brand: string;
  Model: string;
  RentalRate: number;
}

export interface Booking {
  BookingID: string;
  Renter: { FullName: string; Email: string };
  Vehicle: Vehicle;
  StartTime: string;
  EndTime: string;
  DepositAmount: number;
  Status: "Pending" | "Confirmed" | "Cancelled" | "Expired" | "Completed";
  Duration: number;
  TotalCost: number;
}

// Dành riêng cho Renter xem lịch sử cá nhân
export interface MyBooking {
  BookingID: string;
  Vehicle: { LicensePlate: string; Brand: string };
  StartTime: string;
  EndTime: string;
  DepositAmount: number;
  Status: string;
  Duration: number;
  TotalAmount: number;
  createdAt?: string;
  canceledAt?: string;
}

export interface MyStats {
  totalTrips: number;
  totalCost: number;
  peakHours: { hour: number; count: number }[];
}

export interface Report {
  ReportID: number;
  ReportType: "Incident" | "Renter" | "Handover";
  ReportDetails: string;
  Status: "Open" | "Closed" | "Pending";
  IsHighRisk: boolean;
  CreatedAt: string;
  ResolvedAt: string | null;
  Renter: {
    RenterID: string;
    Account: { FullName: string; Email: string } | null;
  } | null;
  Staff: { StaffID: string; Account: { FullName: string } };
  Vehicle: { LicensePlate: string } | null;
}

export interface ReportListResponse extends ApiResponse<Report> {}

export interface CreateReportRequest {
  ReportType: "Incident" | "Renter" | "Handover";
  RenterID?: string | null;
  VehicleID?: string | null;
  ReportDetails: string;
  IsHighRisk?: boolean;
}

export interface CreateReportResponse {
  message: string;
  data: Report;
}

export interface UpdateReportStatusRequest {
  status: "Open" | "Closed" | "Pending";
}

export interface RiskyRenter {
  RenterID: string;
  FullName: string;
  Email: string;
  PhoneNumber: string;
  TotalReports: number;
  HighRiskReports: number;
  RiskLevel: "High" | "Medium" | "Low";
}

export interface RiskyRenterListResponse extends ApiResponse<RiskyRenter> {}

export interface Stats {
  totalBookings: number;
  totalRevenue: number;
  activeRenters: number;
  totalVehicles: number;
  pendingReports: number;
  highRiskRenters: number;
}

export interface RecentBooking {
  BookingID: string;
  Renter: { FullName: string };
  Vehicle: { LicensePlate: string };
  Status: string;
  TotalCost: number;
}

export interface RecentReport {
  ReportID: number;
  ReportType: string;
  Renter: { FullName: string } | null;
  Status: string;
  IsHighRisk: boolean;
}

export interface DriverLicense {
  LicenseID: number;
  RenterID: string;
  LicenseNumber: string;
  IssuedDate: string;
  ExpiryDate: string;
  LicenseType: "Car" | "Motorcycle";
  LicenseImageUrl: string | null;
  IssuedBy: string | null;
  VerifiedStatus: "Pending" | "Verified" | "Rejected";
  VerifiedAt: string | null;
}

