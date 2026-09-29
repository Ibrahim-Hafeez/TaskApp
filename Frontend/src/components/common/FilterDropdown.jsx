import { useEffect, useRef, useState } from "react";
import styles from "./FilterDropdown.module.css";

function FilterDropdown({ label, value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOption =
    options.find((option) => option.value === value) || options[0];

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={styles.wrapper} ref={dropdownRef}>
      <span className={styles.label}>{label}</span>

      <button
        type="button"
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedOption.label}</span>

        <span className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ""}`}>
          ˅
        </span>
      </button>

      {isOpen && (
        <div className={styles.menu} role="listbox">
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                className={`${styles.option} ${
                  isSelected ? styles.selectedOption : ""
                }`}
                onClick={() => handleSelect(option.value)}
                role="option"
                aria-selected={isSelected}
              >
                <span>{option.label}</span>

                {isSelected && <span className={styles.check}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FilterDropdown;
