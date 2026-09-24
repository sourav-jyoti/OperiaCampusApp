// utils/size.js
import { useWindowDimensions } from 'react-native';

export const useScreenSize = () => {
  const { width, height } = useWindowDimensions();

  return {
    width,
    height,
  };
};
