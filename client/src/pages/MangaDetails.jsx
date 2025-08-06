import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const MangaDetails = () => {
  const { id } = useParams();
  const [manga, setManga] = useState(null);
  const [firstChapterId, setFirstChapterId] = useState(null);
  const [chapterLang, setChapterLang] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMangaDetails = async () => {
      const res = await fetch(`https://api.mangadex.org/manga/${id}?includes[]=cover_art`);
      const json = await res.json();
      console.log(json);
      setManga(json.data);
    };

    const fetchFirstAvailableChapter = async () => {
      const res = await fetch(
        `https://api.mangadex.org/chapter?manga=${id}&order[chapter]=asc&limit=100`
      );
      const json = await res.json();

      const chapters = json.data;

      if (!chapters || chapters.length === 0) {
        setFirstChapterId(null);
        setChapterLang(null);
        return;
      }

      // Group chapters by language
      const chaptersByLang = {};
      chapters.forEach(ch => {
        const lang = ch.attributes.translatedLanguage;
        if (!chaptersByLang[lang]) chaptersByLang[lang] = [];
        chaptersByLang[lang].push(ch);
      });

      // Pick the first language with available chapters
      const availableLangs = Object.keys(chaptersByLang);
      const bestLang = availableLangs.includes('en') ? 'en' : availableLangs[0];

      setChapterLang(bestLang);
      setFirstChapterId(chaptersByLang[bestLang][0].id);
    };

    fetchMangaDetails();
    fetchFirstAvailableChapter();
  }, [id]);

  if (!manga) return <p className="p-4 text-2xl text-gray-500 flex items-center mt-50 justify-center">Loading...</p>;

  const coverRel = manga.relationships.find(r => r.type === 'cover_art');
  const coverUrl = coverRel
    ? `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes?.fileName}.512.jpg`
    : 'https://via.placeholder.com/512x700';

  return (
   <div class={`p-8 max-w-4xl mx-auto mt-15 ${manga.attributes.isLocked === true ? 'shadow-none bg-none' : 'shadow-xl bg-white  ' } rounded-lg `}>
  {manga.attributes.isLocked === true ? (
  <p class="text-red-600 flex items-center justify-center mt-20 font-semibold text-lg">
    This manga is locked for premium users.
  </p>
  ) : (
  <>
    <div class="flex flex-col md:flex-row gap-8">
      <div class="flex-shrink-0">
        <img
          src={coverUrl}
          alt="cover"
          class="w-64 h-auto rounded-lg shadow-md object-cover"
        />
      </div>
      <div class="flex-grow">
        <h1 class="text-3xl font-extrabold text-gray-900 mb-3">
          {manga.attributes.title.en || 'No Title'}
        </h1>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 text-gray-700 text-lg mb-6">
          <p>
            <strong class="font-semibold">Status:</strong>{' '}
            {manga.attributes.status}
          </p>
          <p>
            <strong class="font-semibold">Rating:</strong>{' '}
            {manga.attributes.contentRating}
          </p>
        </div>
        <p class="mt-4 text-gray-800 leading-relaxed">
          {manga.attributes.description.en || 'No description available.'}
        </p>
         {firstChapterId ? (
    <button
      onClick={() => navigate(`/read/${firstChapterId}?mangaId=${id}`)}
      class="mt-5 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
    >
      📖 Read Now ({chapterLang?.toUpperCase()})
    </button>
    ) : (
    <p class="mt-10 text-red-600 text-lg">No chapters available in any language.</p>
    )}
      </div>
    </div>

   
  </>
  )}
</div>
  );
};

export default MangaDetails;
