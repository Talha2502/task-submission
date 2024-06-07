import { useEffect, useState } from 'react';

const useGoogleMapsScript = (apiKey: string) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (document.querySelector(`script[src="https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places"]`)) {
      setLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [apiKey]);

  return loaded;
};

export default useGoogleMapsScript;
