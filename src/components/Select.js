import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import TagsReel from "./TagsReel";
import removeLatinChars from "../utils/latins";
import {
  isMatchWith,
  isMatchWithChars,
  isMatchFirstWord,
} from "../utils/match";
import { sort, selectPropsFromObj } from "../utils/general";

const Select = ({
  id,
  label,
  options,
  onChange,
  keys,
  width = "100%",
  placeholder = "Search...",
  className = "",
  defaultSelected = null,
  isClearable = true,
  selectsLimit = null,
  isMulti = false,
  isRequired = false,
  isSearchable = true,
  isLoading = false,
  withCheckBox = false,
  maxListHeight = "300px",
}) => {
  const [search, setSearch] = useState("");
  const [selects, setSelects] = useState(
    defaultSelected && options.includes(defaultSelected) ? defaultSelected : []
  );
  const [isFocus, setIsFocus] = useState(false);
  const searchInput = useRef(null);
  const limit = !isMulti ? 1 : selectsLimit || options.length;

  // Set focus on search input
  useEffect(() => {
    if (isFocus) {
      searchInput.current.focus();
    }
  }, [isFocus]);

  // send list of selected values to parent
  useEffect(() => {
    if (!isRequired || (isRequired && !!selects)) {
      // if is required and has selected options or is not required
      if (typeof keys.value === "string" && !!keys.value) {
        // if value is string
        onChange(selects.map((item) => item[keys.value]));
      } else if (Array.isArray(keys.value) && !!keys.value) {
        // if value is array
        onChange(selects.map((item) => selectPropsFromObj(item, keys.value)));
      } else if (typeof keys.value === "function" && !!keys.value) {
        // if value is function
        onChange(selects.map((item) => keys.value(item)));
      } else {
        // if value is not defined or is not string or array
        throw new Error("Invalid value key");
      }
    }
    setIsFocus(true);
  }, [selects]); // eslint-disable-line

  // remove selected option from list
  const removeFromSelects = (label) => {
    if (selects.length > 0) {
      setSelects((prev) => prev.filter((item) => item[keys.label] !== label));
    }
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
      removeFromSelects(option[keys.label]);
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
      removeFromSelects(selects[selects.length - 1][keys.label]);
    }
  };

  // get search value
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // filter options by search
  const getOptionsList = () => {
    const matchFirstWord = options.filter((option) => {
      return isMatchFirstWord(search, option[keys.label]) && !!search;
    });

    const matchesFullOptions = options
      .filter((option) => !matchFirstWord.includes(option))
      .filter((option) => {
        return isMatchWith(search, option[keys.label]) || !search;
      });

    const matchesAnyChar = options
      .filter((option) => !matchFirstWord.includes(option))
      .filter((option) => !matchesFullOptions.includes(option))
      .filter((option) => {
        return isMatchWithChars(search, option[keys.label]) || !search;
      });

    return [
      ...(!search ? matchFirstWord : sort(matchFirstWord, keys.label)),
      ...(!search ? matchesFullOptions : sort(matchesFullOptions, keys.label)),
      ...(!search ? matchesAnyChar : sort(matchesAnyChar, keys.label)),
    ].map((option, i) => {
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
              if (char === " ") {
                return <span key={index}>&nbsp;</span>;
              }
              // if is match char, add class to highlight
              return removeLatinChars(search.toLowerCase()).includes(
                removeLatinChars(char.toLowerCase())
              ) ? (
                <span key={index} className="text-info">
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
                    removeFromSelects(option[keys.label]); // if checkbox is unchecked remove from selects
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
        className={`rounded-box w-full h-14 p-3 pt-2 pr-12 border-2 flex flex-row items-center${
          " " + className // add custom className if is passed
        }`}
        onClick={() => setIsFocus(true)} // set focus on input when click on component
      >
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
      {((isFocus && !!selectsLimit) || selects.length > 0) && (
        <div className="flex flex-row flex-nowrap w-full">
          {isFocus && !!selectsLimit && (
            <label
              className={`label font-bold w-auto mr-2 ${
                limit === selects.length ? "text-red-500" : ""
              }`}
            >
              {selects.length}/{limit}
            </label>
          )}
          {selects.length > 0 &&
            !withCheckBox &&
            isMulti && ( // if is multi-select and with checkbox render selected options
              <TagsReel
                tags={selects.map((selected) => selected[keys.label])}
                onTagClick={removeFromSelects}
              />
            )}
        </div>
      )}
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
  defaultSelected: PropTypes.object, // set default selected option
  selectsLimit: PropTypes.number, // limit of selects
  isMulti: PropTypes.bool, // if is multi-select
  isRequired: PropTypes.bool, // if is required
  isSearchable: PropTypes.bool, // if is searchable
  withCheckBox: PropTypes.bool, // if is multi-select with checkbox
};

export default Select;
