
import * as React from 'react';
import { Typography } from '../../../components/ui/typography/Typography';
import { ReportExporter } from '../../../components/features/reports/ReportExporter';

export default function ReportsPage() {
  return (
    <div className="space-y-6 animate-fade-in p-6">
      <Typography variant="h2">Trung tâm Báo cáo</Typography>
      <ReportExporter />
    </div>
  );
}
