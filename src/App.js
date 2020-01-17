import React, { useEffect, useState } from 'react';

const App = () => {
  const [data, setData] = useState({});
  const products = Object.values(data);
  useEffect(() => {
    const fetchProducts = async () => {
      //console.log('fetching now');
      const response = await fetch('/data/products.json');
      const json = await response.json();
      //console.log(json.length);
      setData(json);
    };
    fetchProducts();
  }, []);

  return (
    <ul>
      {products.map(product => <li key={product.sku}>{product.title}</li>)}
    </ul>
  );
};

export default App;