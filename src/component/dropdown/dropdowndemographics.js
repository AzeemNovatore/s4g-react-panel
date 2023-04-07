import React from "react";
import { MultiSelect } from "react-multi-select-component";

export default function Dropdowndemographics({
  selected,
  handleChange,
  options,
  label,
}) {
  return (
    <div>
      {/* <h1>Select Fruits</h1>
  <pre>{JSON.stringify(selected)}</pre> */}
      <div className="mt-2">
        <MultiSelect
          options={options}
          value={selected}
          onChange={(values) => handleChange(label, values)}
          labelledBy="Select"
        />
      </div>
    </div>
  );
}
