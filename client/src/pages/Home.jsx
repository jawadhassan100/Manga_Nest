import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


const Home = () => {
  const [mangaList, setMangaList] = useState([]);
  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchManga = async () => {
      setLoading(true);
     try {
       const res = await fetch('https://api.mangadex.org/manga?includes[]=cover_art&limit=50&order[rating]=desc&contentRating[]=safe');
      const data = await res.json();
      console.log(data)
      setMangaList(data.data);
        setLoading(false);
     } catch (error) {
        console.error("Error fetching manga:", error);
      
        return;
     }

    };
    fetchManga();
  }, []);

  const getCoverImage = (manga) => {
    const cover = manga.relationships.find(rel => rel.type === 'cover_art' || rel.type === 'manga');
    return cover
      ? `https://uploads.mangadex.org/covers/${manga.id}/${cover.attributes?.fileName}.512.jpg`
      : 'https://via.placeholder.com/512x700?text=No+Cover';
  };

  if (Loading) {
    return <p className="p-4 text-2xl text-gray-500 flex items-center mt-50 justify-center ">Loading Mangas...</p>;  
  }

  return (
    <div className="px-6 py-10">
      <h1 className="text-2xl  flex justify-center font-bold mb-6"> Manga Explorer</h1>
     

    <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
  {mangaList.map((manga) => {
    const coverUrl = getCoverImage(manga);

    return (
      <Link
        key={manga.id}
        to={`/manga/${manga.id}`}
        className="relative group block w-full break-inside-avoid overflow-hidden rounded-sm"
      >
        <img
          src={coverUrl}
          alt={manga.attributes.title.en}
          className="w-full transition-transform duration-200 group-hover:scale-[1.02]"
        />

        {/* Hover Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-90 translate-y-5 group-hover:translate-y-0 transition-all duration-300 text-white p-3">
          <h3 className="text-sm  line-clamp-1">
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
      
    );
  })}
</div>

    </div>
  );
};

export default Home;
