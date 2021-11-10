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
    // if option is in selects, remove it
    if (selects.includes(option)) {
      removeFromSelects(option);
    } else {
      // if is multi-select add to selects
      if (isMulti) {
        setSelects((prev) =>
          prev.length < limit && !prev.includes(option) // if list length is < than limit and option isn't in list add to selects
            ? [...prev, option]
            : prev
        );
      } else { // if is single-select, clear selects and add option
        setSelects([option]);
      }
    }
  };

  // detect backspace key and remove last selected option
  const handleBackspace = (e) => {
    if (e.which === 8 && !search && selects.length > 0) {
      removeFromSelects(selects[selects.length - 1]);
    }
  };

  // remove duplicated characters from string
  const removeDuplicatesFromString = (str) => {
    return [...str].filter((item, pos, self) => self.indexOf(item) === pos);
  };

  // filter options by search whit powers!!
  const getMatchAnyCharacter = (search = "", evaluated = "") => {
    const cleanSearch = removeDuplicatesFromString(search.toLowerCase());
    const formattedEvaluated = (""+evaluated).toLowerCase();

    let matches = [];
    [...cleanSearch].forEach((char) => {
      if (formattedEvaluated.includes(char) && !matches.includes(char))
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
    let _matches = [];

    const optionsList = options
      .filter((option) => {
        const { isMatch, matches } = getMatchAnyCharacter(
          search,
          option[keys.label]
        );

        if (isMatch) _matches = matches;

        return isMatch || !search;
      })
      .filter(option => { // filter by selected options
        return !search && (withCheckBox || !isMulti) ? option : !selects.includes(option);
      });

    // render options list or options list with matches
    return optionsList.map((option, i) => {
      return (
        <li
          key={option[keys.key]}
          className={`cursor-pointer flex flex-row justify-between items-center${
            i === 0 ? "" : " border-t-2"
          }`}
          onClick={() => addToSelects(option)}
        >
          <span
            className={`p-0 ${selects.includes(option) ? "font-bold" : ""}`}
          >
            {[...("" + option[keys.label])].map((char, index) => {
              // if is match char, add class to highlight
              return _matches.includes(char.toLowerCase()) ? (
                <span key={index} className="font-bold text-info">
                  {char}
                </span>
              ) : (
                <span key={index}>{char}</span>
              );
            })}
          </span>
          {withCheckBox && isMulti && ( // if is multi-select and with checkbox render checkbox
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
      onClick={() => setIsFocus(true)}
    >
      <label className="label font-bold" htmlFor={id}>
        <span className="label-text">{label}</span>
        {isRequired && <span className="text-red-800">*</span>}
      </label>
      <div
        className={`rounded-box w-full h-12 p-3 pr-12 border-2 flex flex-row items-center${
          " " + className
        }`}
        onClick={() => setIsFocus(true)}
      >
        {selects.length > 0 && !withCheckBox && isMulti && (
          <div
            className="flex flex-row items-center w-auto h-auto"
            style={{ maxWidth: "" }}
            contentEditable={false}
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
          selects.length > 0 &&
          selects.map((selected) => (
            <span key={selected[keys.key]}>{selected[keys.label]}</span>
          ))}
        {isSearchable && (
          <input
            type="text"
            className="border-o focus:outline-none h-full"
            ref={searchInput}
            placeholder={placeholder}
            value={search}
            readOnly={!isFocus}
            // onBlur={() => setIsFocus(false)}
            onChange={handleSearch}
            onKeyDown={handleBackspace}
          />
        )}
        {isClearable && (selects.length || search) && (
          <button
            className="btn btn-circle btn-ghost p-0 h-8 max-h-8 min-h-8 w-8 absolute right-4"
            onClick={() => clearSelects()}
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
      {isFocus && (
        <ul
          className="menu rounded-box absolute top-full mt-4 border-2 w-full select-menu"
          onClick={() => setIsFocus(false)}
          style={{
            maxHeight: maxListHeight,
            overflowY: "auto",
          }}
        >
          {isLoading ? (
            <div className="text-center">
              <div className="spinner"></div>
            </div>
          ) : getOptionsList().length > 0 ? (
            getOptionsList()
          ) : (
            <li className="flex items-center">
              <span className="p-0">
                <span className="font-light italic">Nothing match</span>
              </span>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

Select.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  keys: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  width: PropTypes.string,
  isClearable: PropTypes.bool,
  setSelected: PropTypes.object,
  selectsLimit: PropTypes.number,
  isMulti: PropTypes.bool,
  isRequired: PropTypes.bool,
  isSearchable: PropTypes.bool,
  whitCheckBox: PropTypes.bool,
};

export default Select;
