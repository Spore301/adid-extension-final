import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaSearch } from 'react-icons/fa';
import { musicApiClient } from '../api'; // Use the dedicated music client
import { API_PATHS } from '../utils/apiPaths';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio playback error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setIsLoading(true);
    try {
      // Use the dedicated musicApiClient to call your separate backend
      const response = await musicApiClient.post(API_PATHS.MUSIC.SEARCH, { query: searchTerm });
      setSearchResults(response.tracks || []);
    } catch (error) {
      console.error('Failed to search for music:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectTrack = async (track) => {
    try {
      // Use the musicApiClient to get the stream URL from your music backend
      const response = await musicApiClient.get(API_PATHS.MUSIC.GET_STREAM(track.videoId));
      setCurrentTrack({ ...track, streamUrl: response.streamUrl });
      setIsPlaying(true);
      setSearchResults([]);
    } catch (error) {
      console.error('Failed to get stream URL:', error);
    }
  };

  const togglePlayPause = () => {
    if (currentTrack) {
      setIsPlaying(!isPlaying);
    }
  };
  
  return (
    <div className="music-player">
      <div className="search-bar">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a song..."
          />
          <button type="submit" disabled={isLoading}>{isLoading ? '...' : <FaSearch />}</button>
        </form>
      </div>

      {searchResults.length > 0 && (
        <ul className="search-results">
          {searchResults.map((track) => (
            <li key={track.videoId} onClick={() => selectTrack(track)}>
              <img src={track.thumbnail} alt={track.title} />
              <div className="track-info">
                <span>{track.title}</span>
                <small>{track.artist}</small>
              </div>
            </li>
          ))}
        </ul>
      )}

      {currentTrack && (
        <div className="now-playing">
          <img src={currentTrack.thumbnail} alt={currentTrack.title} />
          <div className="track-details">
            <p className="title">{currentTrack.title}</p>
            <p className="artist">{currentTrack.artist}</p>
          </div>
          <button onClick={togglePlayPause} className="play-pause-btn">
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <audio ref={audioRef} src={currentTrack.streamUrl} onEnded={() => setIsPlaying(false)} autoPlay />
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;