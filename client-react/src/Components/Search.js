import React, { useState } from 'react';

function Search() {
  const [search, setSearch] = useState('');
  const [images, setImages] = useState([]);

  const searchDrawings = async (e) => {
    e.preventDefault();
    
    const response = await fetch(`/api/search?translation=${encodeURIComponent(search)}`);
    const data = await response.json();
    console.log(data); // Add this line

    setImages(data);
  };

  return (
    <div>
      <form onSubmit={searchDrawings}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search for a translation..."
        />
        <button type="submit">Search</button>
      </form>

      {images.map((image, index) => (
  <div key={index}>
    <img src={image.imageUrl} alt={image.translation} />
    <p>{image.translation}</p>
  </div>
))}
    </div>
  );
}

export default Search;