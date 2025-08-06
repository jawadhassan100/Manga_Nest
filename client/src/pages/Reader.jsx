// pages/Reader.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const Reader = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const mangaId = new URLSearchParams(location.search).get("mangaId");

  const [imageUrls, setImageUrls] = useState([]);
  const [allChapters, setAllChapters] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);

  // Fetch current chapter images
  useEffect(() => {
    const fetchChapterImages = async () => {
      setImageUrls([]);
      try {
        const res = await fetch(`https://api.mangadex.org/at-home/server/${chapterId}`);
        const json = await res.json();
        const { baseUrl, chapter } = json;
        const urls = chapter.data.map(filename => `${baseUrl}/data/${chapter.hash}/${filename}`);
        setImageUrls(urls);
      } catch (err) {
        console.error("Error loading chapter images:", err);
      }
    };

    fetchChapterImages();
  }, [chapterId]);

  // Fetch all chapters dynamically using passed mangaId
  useEffect(() => {
    if (!mangaId) return;
    const fetchAllChapters = async () => {
      const res = await fetch(`https://api.mangadex.org/chapter?manga=${mangaId}&translatedLanguage[]=en&order[chapter]=asc&limit=100`);
      const json = await res.json();
      const chapters = json.data;
      setAllChapters(chapters);
      const index = chapters.findIndex(ch => ch.id === chapterId);
      setCurrentIndex(index);
    };

    fetchAllChapters();
  }, [mangaId, chapterId]);

  const goToChapter = (index) => {
    const chapter = allChapters[index];
    if (chapter) {
      navigate(`/read/${chapter.id}?mangaId=${mangaId}`);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      

      {/* Top Controls */}
      {/* <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
        <button disabled={currentIndex <= 0} onClick={() => goToChapter(currentIndex - 1)}>⬅️ Previous</button>

        <select
          value={currentIndex}
          onChange={(e) => goToChapter(Number(e.target.value))}
        >
          {allChapters.map((ch, i) => (
            <option key={ch.id} value={i}>
              Chapter {ch.attributes.chapter || 'N/A'}
            </option>
          ))}
        </select>

        <button disabled={currentIndex >= allChapters.length - 1} onClick={() => goToChapter(currentIndex + 1)}>Next ➡️</button>
      </div> */}

      {/* Images */}
      {imageUrls.length === 0 && <p>Loading pages...</p>}
      {imageUrls.map((url, index) => (
        <div className='flex justify-center items-center' >
            <img key={index} src={url} alt={`Page ${index + 1}`} style={{ width: '100%', maxWidth: '800px', marginBottom: '1rem' }} />
        </div>
      ))}

      {/* Bottom Controls */}
      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
        <button disabled={currentIndex <= 0} onClick={() => goToChapter(currentIndex - 1)}>⬅️ Previous</button>
        <select
          value={currentIndex}
          onChange={(e) => goToChapter(Number(e.target.value))}
        >
          {allChapters.map((ch, i) => (
            <option key={ch.id} value={i}>
              Chapter {ch.attributes.chapter || 'N/A'}
            </option>
          ))}
        </select>
        <button disabled={currentIndex >= allChapters.length - 1} onClick={() => goToChapter(currentIndex + 1)}>Next ➡️</button>
      </div>
    </div>
  );
};

export default Reader;
