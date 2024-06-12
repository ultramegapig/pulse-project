import React, { useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../context/AuthContext';
import '../styles/youtube.scss';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayerProps {
  videoId: string;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId }) => {
  const { authState } = useContext(AuthContext);
  const playerRef = useRef<HTMLDivElement | null>(null);
  const playerInstanceRef = useRef<any>(null);

  const sendMetric = async (action: string, value: string) => {
    try {
      const decodedToken: any = jwtDecode(authState.token);
      const user_id = decodedToken.sub.user_id;
      console.log(`Sending metric: ${action} with value: ${value} for user: ${user_id}`);
      await axios.post(
        'http://localhost:5000/api/metrics/gather',
        {
          user_id,
          test_id: null,
          lecture_id: 'lecture123',
          action,
          value
        },
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );
    } catch (error) {
      console.error('Error recording metric:', error);
    }
  };

  const getCurrentTimeInSeconds = () => {
    if (playerInstanceRef.current) {
      const currentTime = playerInstanceRef.current.getCurrentTime();
      return Math.floor(currentTime);
    }
    return 0;
  };

  useEffect(() => {
    const loadYouTubeIframeAPI = () => {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.body.appendChild(script);
    };

    const handlePlayerStateChange = (event: any) => {
      console.log('Player state changed:', event.data);
      if (event.data === window.YT.PlayerState.PAUSED) {
        const currentTime = getCurrentTimeInSeconds();
        sendMetric('pause', '1');
        sendMetric('video_time', currentTime.toString());
      } else if (event.data === window.YT.PlayerState.PLAYING) {
        sendMetric('play', '1');
      }
    };

    const handlePlayerVolumeChange = () => {
      if (playerInstanceRef.current.isMuted()) {
        sendMetric('mute', '1');
      } else {
        sendMetric('unmute', '1');
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        sendMetric('tab_hidden', '1');
      } else {
        sendMetric('tab_visible', '1');
      }
    };

    window.onYouTubeIframeAPIReady = () => {
      console.log('YouTube IFrame API ready');
      playerInstanceRef.current = new window.YT.Player(playerRef.current, {
        videoId: videoId,
        events: {
          onStateChange: handlePlayerStateChange,
          onVolumeChange: handlePlayerVolumeChange
        }
      });
    };

    if (!window.YT) {
      console.log('Loading YouTube IFrame API');
      loadYouTubeIframeAPI();
    } else {
      window.onYouTubeIframeAPIReady();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (playerInstanceRef.current) {
        playerInstanceRef.current.destroy();
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [authState.token, videoId]);

  return (
    <div className='video-container'>
      <div ref={playerRef}></div>
    </div>
  );
};

export default YouTubePlayer;
