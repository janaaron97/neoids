import React, { useState, useEffect } from 'react';

const SearchPageComponent = () => {
  const [search, setSearch] = useState('');
  const [images, setImages] = useState([]);

  const fetchDrawings = async () => {
    const response = await fetch('/api/searchAll');
    const data = await response.json();
    console.log(data);
    setImages(data);
  };

  useEffect(() => {
    fetchDrawings();
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const filteredImages = images.filter((image) =>
    image.translation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <input type="text" value={search} onChange={handleSearch} placeholder="Search translations..." />

      {filteredImages.map((image, index) => (
        <div className="result" key={index}>
          <img className="glyph" src={image.imageUrl} alt={image.translation} />
          <p>{image.translation}</p>
        </div>
      ))}
    </div>
  );
};

export default SearchPageComponent;
