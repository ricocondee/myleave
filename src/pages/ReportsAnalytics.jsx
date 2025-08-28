import React, { useMemo, useState, useRef } from 'react';
import { useLeave } from '../context/LeaveContext';
import { useUser } from '../context/UserContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { ChevronDownIcon, ChevronUpIcon, DownloadIcon, FileIcon } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ReportsAnalytics = () => {
  const { leaveRequests } = useLeave();
  const { users } = useUser();
  const [timeFrame, setTimeFrame] = useState('month');
  const [expandedSection, setExpandedSection] = useState('overview');
  const [isExporting, setIsExporting] = useState(false);

  const overviewSectionRef = useRef(null);
  const employeeSectionRef = useRef(null);
  const departmentSectionRef = useRef(null);

  const statusData = useMemo(() => {
    const counts = { approved: 0, pending: 0, rejected: 0 };
    leaveRequests.forEach(request => { counts[request.status] += 1; });
    if (counts.approved === 0 && counts.pending === 0 && counts.rejected === 0) {
      return [
        { name: 'Approved', value: 8, color: '#10B981' },
        { name: 'Pending', value: 5, color: '#F59E0B' },
        { name: 'Rejected', value: 2, color: '#EF4444' }
      ];
    }
    return [
      { name: 'Approved', value: counts.approved, color: '#10B981' },
      { name: 'Pending', value: counts.pending, color: '#F59E0B' },
      { name: 'Rejected', value: counts.rejected, color: '#EF4444' }
    ];
  }, [leaveRequests]);

  const typeData = useMemo(() => {
    const counts = { paid: 0, unpaid: 0 };
    leaveRequests.forEach(request => { counts[request.type] += 1; });
    if (counts.paid === 0 && counts.unpaid === 0) {
      return [
        { name: 'Paid Leave', value: 10, color: '#3B82F6' },
        { name: 'Unpaid Leave', value: 5, color: '#8B5CF6' }
      ];
    }
    return [
      { name: 'Paid Leave', value: counts.paid, color: '#3B82F6' },
      { name: 'Unpaid Leave', value: counts.unpaid, color: '#8B5CF6' }
    ];
  }, [leaveRequests]);

  const trendData = useMemo(() => {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(now.getMonth() - i);
      months.push({ 
        name: d.toLocaleString('default', { month: 'short' }),
        month: d.getMonth(),
        year: d.getFullYear(),
        approved: 0,
        pending: 0,
        rejected: 0
      });
    }
    leaveRequests.forEach(request => {
      const requestDate = new Date(request.createdAt);
      const monthIndex = months.findIndex(m => m.month === requestDate.getMonth() && m.year === requestDate.getFullYear());
      if (monthIndex !== -1) {
        months[monthIndex][request.status] += 1;
      }
    });
    const hasData = months.some(month => month.approved > 0 || month.pending > 0 || month.rejected > 0);
    if (!hasData) {
      const samplePattern = [
        { approved: 3, pending: 1, rejected: 0 },
        { approved: 4, pending: 2, rejected: 1 },
        { approved: 5, pending: 1, rejected: 2 },
        { approved: 6, pending: 3, rejected: 1 },
        { approved: 4, pending: 2, rejected: 0 },
        { approved: 7, pending: 4, rejected: 2 }
      ];
      months.forEach((month, index) => {
        month.approved = samplePattern[index].approved;
        month.pending = samplePattern[index].pending;
        month.rejected = samplePattern[index].rejected;
      });
    }
    return months;
  }, [leaveRequests]);

  const employeeData = useMemo(() => {
    const employeeCounts = {};
    leaveRequests.forEach(request => {
      if (!employeeCounts[request.employeeId]) {
        employeeCounts[request.employeeId] = { name: request.employeeName, total: 0, approved: 0, pending: 0, rejected: 0 };
      }
      employeeCounts[request.employeeId].total += 1;
      employeeCounts[request.employeeId][request.status] += 1;
    });
    const data = Object.values(employeeCounts).sort((a, b) => b.total - a.total).slice(0, 5);
    if (data.length === 0) {
      return [
        { name: 'John Smith', total: 8, approved: 5, pending: 2, rejected: 1 },
        { name: 'Jane Doe', total: 6, approved: 4, pending: 1, rejected: 1 },
        { name: 'Robert Johnson', total: 5, approved: 3, pending: 2, rejected: 0 },
        { name: 'Emily Davis', total: 4, approved: 2, pending: 1, rejected: 1 },
        { name: 'Michael Wilson', total: 3, approved: 2, pending: 1, rejected: 0 }
      ];
    }
    return data;
  }, [leaveRequests]);

  const departmentData = useMemo(() => {
    const departments = {};
    const employeeDepartments = {};
    users.forEach(user => { if (user.department) { employeeDepartments[user.id] = user.department; } });
    leaveRequests.forEach(request => {
      const dept = employeeDepartments[request.employeeId] || 'Unassigned';
      if (!departments[dept]) { departments[dept] = { name: dept, total: 0, approved: 0, pending: 0, rejected: 0 }; }
      departments[dept].total += 1;
      departments[dept][request.status] += 1;
    });
    const data = Object.values(departments);
    if (data.length === 0) {
      return [
        { name: 'Engineering', total: 12, approved: 8, pending: 3, rejected: 1 },
        { name: 'Marketing', total: 8, approved: 5, pending: 2, rejected: 1 },
        { name: 'HR', total: 6, approved: 4, pending: 1, rejected: 1 },
        { name: 'Finance', total: 5, approved: 3, pending: 1, rejected: 1 },
        { name: 'Operations', total: 4, approved: 2, pending: 1, rejected: 1 }
      ];
    }
    return data;
  }, [leaveRequests, users]);

  const exportToExcel = () => {
    const employeeDepartments = {};
    users.forEach(user => { if (user.department) { employeeDepartments[user.id] = user.department; } });
    const formattedData = leaveRequests.map(request => {
      const createdAt = new Date(request.createdAt).toLocaleDateString();
      const startDate = new Date(request.startDate).toLocaleDateString();
      const endDate = new Date(request.endDate).toLocaleDateString();
      const updatedAt = new Date(request.updatedAt).toLocaleDateString();
      return {
        'Employee Name': request.employeeName,
        'Request Type': request.type.charAt(0).toUpperCase() + request.type.slice(1) + ' Leave',
        'Date Requested': createdAt,
        'Start Date': startDate,
        'End Date': endDate,
        Department: employeeDepartments[request.employeeId] || 'Unassigned',
        Status: request.status.charAt(0).toUpperCase() + request.status.slice(1),
        'Authorized By': request.supervisorName || 'Pending',
        'Last Updated': updatedAt,
        Reason: request.reason,
        Comments: request.supervisorComment || ''
      };
    });
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leave Requests');
    XLSX.writeFile(workbook, 'Leave_Requests_Report.xlsx');
  };

  const toggleSection = section => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];
  const isUsingSampleData = leaveRequests.length === 0;

  return (
    <div className="space-y-6">
      {/* Aquí va tu JSX completo, como lo tenías antes */}
      {/* Overview Section, Employee Analysis, Department Analysis, etc. */}
    </div>
  );
};

export default ReportsAnalytics;