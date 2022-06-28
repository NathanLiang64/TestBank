import { useRef, useEffect } from 'react';

const Loader = ({ isLoading, fetchTransactions }) => {
  const loader = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio <= 0) return;
      if (isLoading) return;
      fetchTransactions();
    }, { threshold: 0 });
    observer.observe(loader.current);
  });
  return (
    <div className="loader" ref={loader} />
  );
};

export default Loader;
