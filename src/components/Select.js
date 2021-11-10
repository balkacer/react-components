import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

const Select = ({
  id,
  label,
  options,
  onChange,
  keys,
  width = "100%",
  placeholder = "Search...",
  className = "",
  setSelected = null,
  isClearable = true,
  selectsLimit = null,
  isMulti = false,
  isRequired = false,
  isSearchable = true,
  isDisabled = false,
  isLoading = false,
  withCheckBox = false,
  maxListHeight = "300px",
}) => {
  const [search, setSearch] = useState("");
  const [selects, setSelects] = useState([]);
  const [limit, setLimit] = useState(selectsLimit || options.length);
  const [isFocus, setIsFocus] = useState(false);
  const searchInput = useRef(null);

  // Set the default selected value
  useEffect(() => {
    if (setSelected && options.includes(setSelected)) {
      setSelects([setSelected]);
    }
  }, [setSelected, options]);

  // if isn't multi-select set select limit to 1
  useEffect(() => {
    if (!isMulti) setLimit(1);
  }, [isMulti]);

  // Set focus on search input
  useEffect(() => {
    if (isFocus) {
      searchInput.current.focus();
    }
  }, [isFocus]);

  // Send selected options to parent
  useEffect(() => {
    // if is required and no options selected or is not required
    if (!isRequired || (isRequired && !!selects)) {
      // get and process value options to return
      if (typeof keys.value === "string" && !!keys.value) {
        onChange(selects.map((item) => item[keys.value]));
      } else if (Array.isArray(keys.value) && !!keys.value) {
        onChange(selects.map((item) => pickProperties(item, keys.value)));
      } else if (typeof keys.value === "function" && !!keys.value) {
        onChange(selects.map((item) => keys.value(item)));
      } else {
        throw new Error("Invalid value key");
      }
    }
    setIsFocus(true);
  }, [selects]); // eslint-disable-line

  // pick properties from object
  const pickProperties = (obj, keys) => {
    return Object.keys(obj).reduce((acc, key) => {
      if (keys.includes(key)) {
        acc[key] = obj[key];
      }
      return acc;
    }, {});
  };

  // remove selected option from list
  const removeFromSelects = (option) => {
    if (selects.length > 0 && selects.includes(option))
      setSelects((prev) => prev.filter((item) => item !== option));
  };

  // clear all selected options
  const clearSelects = () => {
    setSearch("");
    setSelects([]);
  };

  // add selected option to list
  const addToSelects = (option) => {
    setSearch("");
    if (selects.includes(option)) {
      // if option is already selected
      removeFromSelects(option);
    } else {
      if (isMulti) {
        // if is multi-select
        setSelects((prev) =>
          prev.length < limit && !prev.includes(option) // if list length is < than limit and option isn't in list add to selects
            ? [...prev, option]
            : prev
        );
      } else {
        // if is single-select, clear selects and add option
        setSelects([option]);
      }
    }
  };

  // detect backspace key and remove last selected option
  const handleBackspace = (e) => {
    if (e.which === 8 && !search && selects.length > 0) {
      // if backspace key and no search and selects length > 0
      removeFromSelects(selects[selects.length - 1]);
    }
  };

  // remove duplicated characters from string
  const removeDuplicatesFromString = (str) => {
    return [...str].filter((item, pos, self) => self.indexOf(item) === pos);
  };

  // filter options by search whit powers (Fuzzy Search)!!
  const getMatchAnyCharacter = (search = "", evaluated = "") => {
    const cleanSearch = removeDuplicatesFromString(search.toLowerCase());
    const formattedEvaluated = ("" + evaluated).toLowerCase();

    let matches = [];
    [...cleanSearch].forEach((char) => {
      if (formattedEvaluated.includes(char) && !matches.includes(char))
        // if char is in evaluated and not in matches add to matches
        matches.push(char);
    });
    return { isMatch: matches.length === cleanSearch.length, matches };
  };

  // get search value
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // filter options by search
  const getOptionsList = () => {
    // render options list
    return options
      .filter((option) => {
        // filter not selected options
        return !search && (withCheckBox || !isMulti)
          ? option
          : !selects.includes(option);
      })
      .filter((option) => {
        // filter options by match with search or all options if search is empty
        return (
          getMatchAnyCharacter(search, option[keys.label]).isMatch || !search
        );
      })
      .map((option, i) => {
        return (
          <li
            key={option[keys.key]}
            className={`cursor-pointer flex flex-row justify-between items-center pointer-events-auto${
              i === 0 ? "" : " border-t-2"
            }`}
            onClick={() => addToSelects(option)}
          >
            <span
              className={`p-0 ${selects.includes(option) ? "font-bold" : ""}`}
            >
              {[...("" + option[keys.label])].map((char, index) => {
                // if is match char, add class to highlight
                return search.includes(char.toLowerCase()) ? (
                  <span key={index} className="font-bold text-info">
                    {char}
                  </span>
                ) : (
                  <span key={index}>{char}</span>
                );
              })}
            </span>
            {withCheckBox &&
              isMulti && ( // if is multi-select and with checkbox render checkbox
                <input
                  type="checkbox"
                  className="checkbox input-info mr-4"
                  checked={selects.includes(option)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      addToSelects(option); // if checkbox is checked add to selects
                    } else {
                      removeFromSelects(option); // if checkbox is unchecked remove from selects
                    }
                  }}
                />
              )}
          </li>
        );
      });
  };

  return (
    <div
      className="form-group h-auto flex flex-col relative"
      style={{ width: width || "100%" }}
      onClick={() => setIsFocus(true)} // set focus on input when click on component
    >
      <label className="label font-bold" htmlFor={id}>
        <span className="label-text">{label}</span>
        {isRequired && <span className="text-red-800">*</span>}
      </label>
      <div
        className={`rounded-box w-full h-12 p-3 pr-12 border-2 flex flex-row items-center${
          " " + className // add custom className if is passed
        }`}
        onClick={() => setIsFocus(true)} // set focus on input when click on component
      >
        {selects.length > 0 &&
          !withCheckBox &&
          isMulti && ( // if is multi-select and with checkbox render selected options
            <div
              className="flex flex-row items-center w-auto h-auto"
              style={{ maxWidth: "" }}
            >
              {selects.map((selected) => (
                <div
                  key={selected[keys.key]}
                  className="badge badge-info p-0 py-2 px-4 mr-2 h-full rounded-lg"
                  onClick={() => {
                    removeFromSelects(selected);
                  }}
                >
                  {selected[keys.label]}
                </div>
              ))}
            </div>
          )}
        {!isMulti &&
          selects.length > 0 && // if is single-select and has selected option render selected option
          selects.map((selected) => (
            <span key={selected[keys.key]}>{selected[keys.label]}</span>
          ))}
        {isSearchable && (
          <input
            type="text"
            className="border-o focus:outline-none h-full"
            ref={searchInput} // connect input to ref
            placeholder={placeholder}
            value={search}
            readOnly={!isFocus || selects.length === limit} // if is not focus and has limit selected options, readonly input
            // onBlur={() => setIsFocus(false)} // set focus off when blur
            onChange={handleSearch}
            onKeyDown={handleBackspace} // detect backspace key and remove last selected option
          />
        )}
        {isClearable &&
          (selects.length || search) && ( // if is clearable and has selected or search options render clear button
            <button
              className="btn btn-circle btn-ghost btn-info p-0 h-6 max-h-6 min-h-6 w-6 absolute right-4"
              onClick={() => clearSelects()} // clear selects
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-4 h-4 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          )}
      </div>
      {(isFocus && !!selectsLimit) && (<label class="label">
        <span class="label-text-alt italic">Limit: {limit}</span> 
      </label>)}
      {isFocus && ( // if is focus render options list
        <ul
          className="menu rounded-box absolute top-full mt-1 border-2 w-full select-menu"
          style={{
            maxHeight: maxListHeight,
            overflowY: "auto",
          }}
        >
          {isLoading ? ( // if is loading render loading
            <div class="flex justify-center items-center m-5">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-info"></div>
            </div>
          ) : getOptionsList().length > 0 ? ( // if has options render options list else render not found message
            getOptionsList()
          ) : (
            <li className="flex items-center">
              <span className="p-0">
                <span className="font-light italic">No options left...</span>
              </span>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

Select.propTypes = {
  id: PropTypes.string.isRequired, // id of select
  label: PropTypes.string.isRequired, // label of select
  options: PropTypes.array.isRequired, // options of select
  onChange: PropTypes.func.isRequired, // onChange function
  keys: PropTypes.object.isRequired, // keys of options
  placeholder: PropTypes.string, // placeholder of select
  className: PropTypes.string, // custom className
  width: PropTypes.string, // custom width
  isClearable: PropTypes.bool, // if is clearable
  setSelected: PropTypes.object, // set default selected option
  selectsLimit: PropTypes.number, // limit of selects
  isMulti: PropTypes.bool, // if is multi-select
  isRequired: PropTypes.bool, // if is required
  isSearchable: PropTypes.bool, // if is searchable
  whitCheckBox: PropTypes.bool, // if is multi-select with checkbox
};

export default Select;
