import React from 'react';
import './Loader.css'

const Loader = () => {
  return (
    <div id="page" className='mt-5'>
        <div id="loader">
            <div id="ring"></div>
            <div id="ring"></div>
            <div id="ring"></div>
            <div id="ring"></div>
            <div id="h3">loading</div>
        </div>
</div>
  );
};

export default Loader;
