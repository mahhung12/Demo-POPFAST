import React from "react";

interface ChartTabProps {
  selected: "optionOne" | "optionTwo" | "optionThree";
  onChange: (option: "optionOne" | "optionTwo" | "optionThree") => void;
}

const ChartTab: React.FC<ChartTabProps> = ({ selected, onChange }) => {
  const getButtonClass = (option: "optionOne" | "optionTwo" | "optionThree") =>
    selected === option
      ? "bg-gray-400 text-white shadow-theme-xs" 
      : "bg-gray-100 text-gray-700 hover:bg-gray-300"; 

  return (
    <div className="flex items-center gap-1 rounded-lg">
      <button
        onClick={() => onChange("optionOne")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm ${getButtonClass("optionOne")}`}
      >
        Monthly
      </button>

      <button
        onClick={() => onChange("optionTwo")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm ${getButtonClass("optionTwo")}`}
      >
        Quarterly
      </button>

      <button
        onClick={() => onChange("optionThree")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm ${getButtonClass("optionThree")}`}
      >
        Annually
      </button>
    </div>
  );
};

export default ChartTab;
