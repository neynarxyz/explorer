import { useEffect, useState } from 'react';

const useSearchParamsWithoutSuspense = () => {
  const [params, setParams] = useState<URLSearchParams | null>(null);

  useEffect(() => {
    setParams(new URLSearchParams(window.location.search));
  }, []);

  return params;
};

export default useSearchParamsWithoutSuspense;
