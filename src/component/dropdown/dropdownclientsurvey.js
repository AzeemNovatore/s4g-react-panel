import React, { useState } from "react";
import Select from "react-select";

export default function Dropdownclientsurvey({
  options,
  defaultValue,
  handleChange,
}) {
  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRtl, setIsRtl] = useState(false);

  return (
    <div className="mt-1">
      <Select
        className="select-basic-single"
        classNamePrefix="select"
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isLoading={isLoading}
        isClearable={isClearable}
        isRtl={isRtl}
        isSearchable={isSearchable}
        name="client"
        options={options}
        onChange={handleChange}
      />
    </div>
  );
}
