"use client";

interface StatsFooterProps {
  total: number;
}

export default function StatsFooter({ total }: StatsFooterProps) {
  return (
    <div className="mt-12 pt-6 border-t border-gray-800/50">
      <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-emerald-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Auto-saved locally</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-emerald-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span>Cloud synced</span>
          </div>
        </div>
        <div className="text-gray-400">Total: {total} documents</div>
      </div>
    </div>
  );
}
