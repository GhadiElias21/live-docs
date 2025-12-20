"use client";

interface Props {
  content: string;
  setContent: (v: string) => void;
}

export default function DocumentEditor({ content, setContent }: Props) {
  return (
    <textarea
      value={content}
      onChange={(e) => setContent(e.target.value)}
      placeholder="Start writing your masterpiece..."
      className="w-full min-h-[calc(100vh-200px)] p-8 bg-gray-800/50 border border-gray-700/50 rounded-xl resize-none text-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
    />
  );
}
