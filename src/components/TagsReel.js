import React, { useEffect, useState, useRef } from "react";
import propTypes from "prop-types";

const TagReel = ({ tags, onTagClick }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollPosition;
    }
  }, [scrollPosition]);

  return (
    <div ref={containerRef} className="tag-reel w-full h-12">
      <button
        className="btn btn-info w-8 max-h-8 min-h-8 rounded-full transition-all opacity-0 hover:opacity-100 absolute z-10"
        onClick={() => setScrollPosition(0)}
      >
        L
      </button>
      {tags.map((tag, index) => (
        <div
          key={index}
          className="badge badge-info p-4 mr-2 flex flex-nowrap"
          onClick={() => onTagClick(tag)}
        >
          {[...tag].map((char, index) => {
            if (char === " ") {
              return <span key={index}>&nbsp;</span>;
            } else {
              return <span key={index}>{char}</span>;
            }
          })}
        </div>
      ))}
      <button
        className="btn btn-info w-8 max-h-8 min-h-8 rounded-full transition-all opacity-0 hover:opacity-100 right-0 absolute z-10"
        onClick={() => setScrollPosition(containerRef.current.scrollWidth)}
      >
        R
      </button>
    </div>
  );
};

TagReel.propTypes = {
  tags: propTypes.arrayOf(propTypes.string).isRequired,
  onTagClick: propTypes.func.isRequired,
};

export default TagReel;
