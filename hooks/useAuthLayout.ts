import { useEffect, useState } from 'react';
import { fetchImage } from '@/lib/cloudinary';

const useAuthLayout = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>(undefined);
  const [nextBackgroundImage, setNextBackgroundImage] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getImage = async () => {
      try {
        const { image } = await fetchImage();
        setBackgroundImage(image);
        // Prefetch the next image
        const { image: nextImage } = await fetchImage();
        setNextBackgroundImage(nextImage);
      } catch (error) {
        console.error('Error fetching image from Cloudinary:', error);
      } finally {
        setLoading(false);
      }
    };

    getImage();
  }, []);

  const getNextImage = () => {
    if (nextBackgroundImage) {
      setBackgroundImage(nextBackgroundImage);
      setLoading(true);
      fetchImage()
        .then(({ image }) => {
          setNextBackgroundImage(image);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching next image from Cloudinary:', error);
          setLoading(false);
        });
    }
  };

  return {
    backgroundImage,
    loading,
    getNextImage,
  };
};

export default useAuthLayout;