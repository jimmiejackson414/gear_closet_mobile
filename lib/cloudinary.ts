import { Cloudinary } from '@cloudinary/url-gen';

const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const authPagesPath = process.env.EXPO_PUBLIC_CLOUDINARY_AUTH_PAGES_PATH;

const cld = new Cloudinary({
  cloud: { cloudName },
  url: { secure: true },
});

// Local cache for image URLs
let cachedImageUrls: string[] = [];

// Function to fetch all image URLs and cache them
const cacheImageUrls = async () => {
  const imageUrls = [];
  for (let i = 1; i <= 14; i++) {
    const imageUrl = cld.image(`${authPagesPath}/background${i}`)
      .format('auto')
      .toURL();
    imageUrls.push(imageUrl);
  }
  cachedImageUrls = imageUrls;
};

// Function to fetch a random image URL from the cache
const fetchImage = async () => {
  if (cachedImageUrls.length === 0) {
    await cacheImageUrls();
  }
  const randIndex = Math.floor(Math.random() * cachedImageUrls.length);
  return { image: cachedImageUrls[randIndex] };
};

// Initialize the cache when the module is loaded
cacheImageUrls();

export {
  fetchImage, cld,
};