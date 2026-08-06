
'use client';
import * as React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { generateReportData } from '../../../app/actions/reports';
import { GlassPanel } from '../../ui/glass-panel/GlassPanel';
import { Typography } from '../../ui/typography/Typography';
import { Download, FileText, TableProperties } from 'lucide-react';

export function ReportExporter() {
  const [loading, setLoading] = React.useState(false);
  const [reportType, setReportType] = React.useState('Cash Flow');
  
  const downloadPDF = async () => {
    setLoading(true);
    try {
      const data = await generateReportData(reportType, { from: '', to: '' });
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text(`Bao cao: ${reportType}`, 14, 22);
      
      const tableColumn = ["Ngay", "Mo ta", "Phan loai", "Loai", "So tien"];
      const tableRows = data.map((row: any) => [
        new Date(row.date).toLocaleDateString(),
        row.description,
        row.category,
        row.type,
        row.amount.toLocaleString()
      ]);
      
      (doc as any).autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 30,
      });
      
      doc.save(`${reportType}.pdf`);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = async () => {
    setLoading(true);
    try {
      const data = await generateReportData(reportType, { from: '', to: '' });
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
      XLSX.writeFile(workbook, `${reportType}.xlsx`);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = async () => {
    setLoading(true);
    try {
      const data = await generateReportData(reportType, { from: '', to: '' });
      const worksheet = XLSX.utils.json_to_sheet(data);
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${reportType}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassPanel className="p-8 max-w-3xl">
      <Typography variant="h3" className="mb-6">Xuất Báo Cáo</Typography>
      
      <div className="flex gap-4 mb-8">
        <select value={reportType} onChange={e => setReportType(e.target.value)} className="bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-aurora-cyan/50">
          <option value="Cash Flow">Lưu chuyển tiền tệ</option>
          <option value="Income Report">Báo cáo doanh thu</option>
          <option value="Expense Report">Báo cáo chi phí</option>
          <option value="Balance Summary">Bảng cân đối kế toán</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button onClick={downloadPDF} disabled={loading} className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 p-4 rounded-xl transition-all">
          <FileText size={20} />
          Xuất PDF
        </button>
        <button onClick={downloadExcel} disabled={loading} className="flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 p-4 rounded-xl transition-all">
          <TableProperties size={20} />
          Xuất Excel
        </button>
        <button onClick={downloadCSV} disabled={loading} className="flex items-center justify-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 p-4 rounded-xl transition-all">
          <Download size={20} />
          Xuất CSV
        </button>
      </div>
    </GlassPanel>
  );
}
