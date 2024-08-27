import { useState, useEffect } from 'react';
import { fetchImage } from '@/lib/cloudinary';

const useAuthLayout = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getImage = async () => {
      try {
        const { image } = await fetchImage();
        setBackgroundImage(image);
      } catch (error) {
        console.error('Error fetching image from Cloudinary:', error);
      } finally {
        setLoading(false);
      }
    };

    getImage();
  }, []);

  return {
    backgroundImage, loading, 
  };
};

export default useAuthLayout;