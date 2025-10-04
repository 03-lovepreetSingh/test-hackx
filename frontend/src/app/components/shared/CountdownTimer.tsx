import React from 'react';
interface CountdownTimerProps {
  daysLeft: number;
}
export function CountdownTimer({
  daysLeft
}: CountdownTimerProps) {
  // For this example, we'll use fixed values for hours, minutes, seconds
  // In a real implementation, you would calculate these based on the actual deadline
  return <div className="flex gap-2">
      <div className="bg-[#121212] text-center p-2 rounded-md w-12">
        <div className="text-xl font-bold">
          {daysLeft < 10 ? `0${daysLeft}` : daysLeft}
        </div>
        <div className="text-xs text-gray-500">D</div>
      </div>
      <div className="bg-[#121212] text-center p-2 rounded-md w-12">
        <div className="text-xl font-bold">01</div>
        <div className="text-xs text-gray-500">H</div>
      </div>
      <div className="bg-[#121212] text-center p-2 rounded-md w-12">
        <div className="text-xl font-bold">42</div>
        <div className="text-xs text-gray-500">M</div>
      </div>
      <div className="bg-[#121212] text-center p-2 rounded-md w-12">
        <div className="text-xl font-bold">31</div>
        <div className="text-xs text-gray-500">S</div>
      </div>
    </div>;
}