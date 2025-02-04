import React from "react";

interface SwitchProps {
  isChecked: boolean;
  onChange: (checked: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({ isChecked, onChange }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only"
        checked={isChecked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div
        className={`w-11 h-6 rounded-full ${isChecked ? `bg-[#304d6d] dark:bg-blue-600` : `bg-gray-400`} relative transition-colors`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white border border-gray-300 rounded-full transition-transform ${isChecked ? "transform translate-x-5" : ""}`}
        ></span>
      </div>
    </label>
  );
};

export default Switch;
