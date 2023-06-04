import React from 'react';
import { Link } from "react-router-dom";
import SearchPageComponent from './SearchPageComponent';
import "./Base.css";

const Base = () => {
  return (
    <div className="glyph-list">
        <div className="navigation">
            <Link to="/draw">Draw</Link>
        </div> 
        <SearchPageComponent />
    </div>
  );
};

export default Base;
 