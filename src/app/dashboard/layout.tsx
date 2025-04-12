import React from 'react';
import { DashboardWrapper } from '@/components/layout/dashboard-wrapper'; // Adjust path if needed

export default function DashboardSegmentLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardWrapper>
      {children}
    </DashboardWrapper>
  );
} 