import React, { useState } from "react";
import { MultiSelect } from "react-multi-select-component";
export default function Dropdowncharitycategory({
  selected,
  handleChange,
  optionscat,
}) {
  return (
    <div className="mt-2">
      <MultiSelect
        options={optionscat}
        value={selected}
        onChange={(values) => handleChange("charityCategories", values)}
        labelledBy="Select"
      />
    </div>
  );
}
