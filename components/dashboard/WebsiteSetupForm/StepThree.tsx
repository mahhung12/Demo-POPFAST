import React from "react";

export default function StepThreeForm({ onBack }: { onBack: () => void }) {
  return (
    <div>
      <p className="text-sm text-zinc-400 mb-6">Attribute revenue (optional).</p>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="bg-zinc-700 hover:bg-zinc-600 text-white py-2 px-4 rounded-md transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition-colors"
        >
          Finish
        </button>
      </div>
    </div>
  );
}
