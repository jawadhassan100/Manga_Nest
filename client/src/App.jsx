import React from 'react'
import './App.css'
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home'
import MangaDetails from './pages/MangaDetails';
import Reader from './pages/Reader';
import Featured from './pages/Featured';
import Navbar from './pages/Navbar';
import SearchResults from './pages/SearchResults';
import Tabs from './pages/Tabs';
import Wheel from './pages/Wheel';


const App = () => {
  return (
    <>
    <Navbar/>
   
    <div className='pt-16'>
    <Routes>
       
      <Route path="/" element={<Home />} />
      <Route path="/manga/:id" element={<MangaDetails />} />
      <Route path="/read/:chapterId" element={<Reader />} />
       <Route path="/featured" element={<Featured />} />
       <Route path="/search" element={<SearchResults />} />
       <Route path="/tabs" element={<Tabs />} />
       <Route path="/wheel" element={<Wheel />} />
    </Routes>
    </div>
    </>
    
  )
}

export default App