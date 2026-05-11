import React, { useState, useRef, useEffect } from 'react';
import type { Location } from '../../types/location';
import { useLocationSearch } from '../../hooks/useLocationSearch';
import { useDebounce } from '../../hooks/useDebounce';
import { sanitizeText } from '../../utils/sanitize';
import styles from './LocationHeader.module.css';

interface LocationHeaderProps {
  location: Location | null;
  onLocationChange: (location: Location) => void;
}

export const LocationHeader: React.FC<LocationHeaderProps> = ({ location, onLocationChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { search, searchResults, loading: searchLoading } = useLocationSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const debouncedInputValue = useDebounce(inputValue, 300);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (isEditing) {
      search(debouncedInputValue);
    }
  }, [debouncedInputValue, isEditing, search]);

  const handleEdit = () => {
    setInputValue(location?.name || '');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setInputValue('');
    search('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = sanitizeText(e.target.value);
    setInputValue(value);
  };

  const handleLocationSelect = (selectedLocation: Location) => {
    onLocationChange(selectedLocation);
    setIsEditing(false);
    setInputValue('');
    search('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className={styles.locationEdit}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search location..."
          className={styles.locationInput}
        />
        {searchLoading && (
          <div className={styles.searchStatus}>SEARCHING...</div>
        )}
        {searchResults.length > 0 && (
          <div className={styles.searchResults}>
            {searchResults.map((result, index) => (
              <button
                key={`${result.name}-${result.latitude}-${result.longitude}-${index}`}
                className={styles.searchResult}
                onClick={() => handleLocationSelect(result)}
                type="button"
              >
                <div className={styles.resultName}>{sanitizeText(result.name)}</div>
                {(result.admin1 || result.country) && (
                  <div className={styles.resultDetails}>
                    {[result.admin1, result.country].filter(Boolean).map(text => sanitizeText(text || '')).join(', ')}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
        {!searchLoading && inputValue && searchResults.length === 0 && (
          <div className={styles.searchStatus}>NO RESULTS FOUND</div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.locationDisplay}>
      <button
        className={styles.locationButton}
        onClick={handleEdit}
        type="button"
      >
        *{sanitizeText(location?.name || 'Loading...')}*
      </button>
    </div>
  );
};
