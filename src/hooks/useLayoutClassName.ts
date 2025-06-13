import { useEffect } from 'react';
const useLayoutClassName = (className: string) => {
  useEffect(() => {
    const element = document.documentElement;
    element.classList.add(className);

    return () => {
      element.classList.remove(className);
    };
  }, [className]);
};

export default useLayoutClassName;
