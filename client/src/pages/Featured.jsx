// pages/Featured.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const featuredTitles = [
  'Naruto',
  'One Piece',
  'Dragon Ball',
  'Bleach',
  'Attack on Titan',
  'Demon Slayer',
  'My Hero Academia',
  'Jujutsu Kaisen',
  'Death Note',
  'Tokyo Ghoul',
  'Hunter x Hunter',
  'One Punch Man',
  'Fullmetal Alchemist',
  'Black Clover',
  'Chainsaw Man',
  'Fairy Tail',
  'Blue Lock',
  'The Seven Deadly Sins',
  'Spy x Family',
  'Vinland Saga',
  'Haikyuu!!',
  'Dr. Stone',
  'Mob Psycho 100',
  'Berserk',
  'JoJo\'s Bizarre Adventure',
  'Sword Art Online',
  'Fire Force',
  'Re:Zero',
  'Akira',
  'Tokyo Revengers',
  'Dragon ball z',
  'Dragon Ball Super',
  'Pokemon Adventures',
  'Pokemon',
  'Death Note',

];



const Featured = () => {
  const [featuredManga, setFeaturedManga] = useState([]);
   const [Loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
      const fetched = await Promise.all(
        featuredTitles.map(async (title) => {
          const res = await fetch(
            `https://api.mangadex.org/manga?title=${encodeURIComponent(title)}&includes[]=cover_art&limit=1`
          );
          const json = await res.json();
          return json.data[0]; // get top result
        })
      );
      setFeaturedManga(fetched.filter(Boolean));
      setLoading(false);
      } catch (error) {
        console.error("Error fetching featured manga:", error);
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const getCoverImage = (manga) => {
    const cover = manga.relationships.find(rel => rel.type === 'cover_art' || rel.type === 'manga');
    return cover
      ? `https://uploads.mangadex.org/covers/${manga.id}/${cover.attributes?.fileName}.512.jpg`
      : 'https://via.placeholder.com/512x700?text=No+Cover';
  };

  // Utility to remove duplicates
const getUniqueManga = (arr) => {
  const seen = new Set();
  return arr.filter(manga => {
    if (seen.has(manga.id)) return false;
    seen.add(manga.id);
    return true;
  });
};
const uniqueMangaList = getUniqueManga(featuredManga);

 if (Loading) {
    return <p className="p-4 text-2xl text-gray-500 flex items-center mt-50 justify-center ">Loading Mangas...</p>;  
  }

  return (
    <div className="px-6 py-10">
      <h1 className="text-2xl flex justify-center font-bold mb-6"> Featured Manga</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {uniqueMangaList.map((manga) => (
          <Link
            key={manga.id}
            to={`/manga/${manga.id}`}
            className="relative group overflow-hidden rounded shadow"
          >
            <img
              src={getCoverImage(manga)}
              alt={manga.attributes.title.en}
              className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
            />

            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <h3 className="text-sm line-clamp-1">
                {manga.attributes.title.en || 'No Title'}
              </h3>
              <p className="text-xs">Rating: {manga.attributes.contentRating}</p>
               <span
            className={`text-[10px] px-2 py-1 rounded-full mt-1 inline-block ${
              manga.attributes.isLocked ? 'bg-red-600' : 'bg-green-600'
            }`}
          >
            {manga.attributes.isLocked ? 'Premium' : 'Free'}
          </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Featured;
