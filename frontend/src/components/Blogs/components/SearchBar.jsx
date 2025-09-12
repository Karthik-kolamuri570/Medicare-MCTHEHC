import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ query: query.trim(), tags: tags.trim() });
  };

  const handleClear = () => {
    setQuery('');
    setTags('');
    onSearch({ query: '', tags: '' });
  };

  const styles = {
    form: {
      backgroundColor: '#fff',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      maxWidth: '700px',
      margin: '0 auto 20px',
      fontFamily: 'Arial, sans-serif',
    },
    inputsWrapper: {
      display: 'flex',
      gap: '12px',
      marginBottom: '12px',
      flexWrap: 'wrap',
    },
    input: {
      flex: '1',
      padding: '10px 14px',
      fontSize: '1rem',
      borderRadius: '6px',
      border: '1.8px solid #ddd',
      outline: 'none',
      boxSizing: 'border-box',
      minWidth: '200px',
      transition: 'border-color 0.3s',
    },
    inputFocus: {
      borderColor: '#0077cc',
    },
    buttonsWrapper: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-start',
      flexWrap: 'wrap',
    },
    btnPrimary: {
      backgroundColor: '#0077cc',
      border: 'none',
      borderRadius: '6px',
      color: 'white',
      padding: '10px 24px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      userSelect: 'none',
      fontSize: '1rem',
    },
    btnPrimaryHover: {
      backgroundColor: '#005fa3',
    },
    btnSecondary: {
      backgroundColor: '#e0e0e0',
      border: 'none',
      borderRadius: '6px',
      color: '#333',
      padding: '10px 24px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      userSelect: 'none',
      fontSize: '1rem',
    },
    btnSecondaryHover: {
      backgroundColor: '#c7c7c7',
    },
  };

  // Optional: simple hover state handling for buttons
  const [primaryHover, setPrimaryHover] = React.useState(false);
  const [secondaryHover, setSecondaryHover] = React.useState(false);

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <div style={styles.inputsWrapper}>
        <input
          type="text"
          placeholder="Search blogs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            ...styles.input,
          }}
          onFocus={(e) => e.target.style.borderColor = '#0077cc'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={{
            ...styles.input,
          }}
          onFocus={(e) => e.target.style.borderColor = '#0077cc'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
      </div>

      <div style={styles.buttonsWrapper}>
        <button
          type="submit"
          style={{
            ...styles.btnPrimary,
            ...(primaryHover ? styles.btnPrimaryHover : {}),
          }}
          onMouseEnter={() => setPrimaryHover(true)}
          onMouseLeave={() => setPrimaryHover(false)}
        >
          Search
        </button>
        <button
          type="button"
          onClick={handleClear}
          style={{
            ...styles.btnSecondary,
            ...(secondaryHover ? styles.btnSecondaryHover : {}),
          }}
          onMouseEnter={() => setSecondaryHover(true)}
          onMouseLeave={() => setSecondaryHover(false)}
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
