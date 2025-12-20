"use client";

interface Props {
  content: string;
}

export default function DocumentFooter({ content }: Props) {
  const words = Math.ceil(content.length / 5);

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between text-sm text-gray-400">
      <div className="flex gap-6">
        <span>Auto-save enabled</span>
        <span>{content.length} characters</span>
        <span>{words} words</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
          <span className="text-emerald-400 font-bold">A</span>
        </div>
        <span>You</span>
      </div>
    </div>
  );
}
