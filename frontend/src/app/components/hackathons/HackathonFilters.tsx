import React from 'react';
import { Button } from '@/app/components/ui/button';
export function HackathonFilters() {
  const filters = [{
    label: 'Total Prize: All',
    value: 'prize'
  }, {
    label: 'Ecosystem: All',
    value: 'ecosystem'
  }, {
    label: 'Tech Stack: All',
    value: 'tech'
  }, {
    label: 'Status: Live, Upcoming',
    value: 'status'
  }];
  return <div className="flex flex-wrap gap-2">
      {filters.map(filter => <Button key={filter.value} variant="outline" className="bg-[#1a1a1a] border-[#2a2a2a] hover:bg-[#252525] text-sm font-normal">
          {filter.label}
        </Button>)}
    </div>;
}