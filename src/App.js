import React, { useEffect, useState } from 'react';
import 'rbx/index.css';
import { Button, Card, Container, Column } from 'rbx';

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
    <Column.Group multiline={true}>
      {products.map(product => <Product product={product}></Product>)}
    </Column.Group>
  );
};

const Product = ({product}) => {
  return (
  <Column size={4}>
    
    <Card>
      <Card.Header>{product.title}</Card.Header>
      <Card.Image><img src={`/data/products/${product.sku}_2.jpg`} alt="product"/></Card.Image>
      <Card.Content>{product.description}</Card.Content>
      <Card.Footer>{product.price}</Card.Footer>
      <Card.Footer.Item><Button.Group>
        <Button>S</Button><Button>M</Button><Button>L</Button><Button>XL</Button>
        </Button.Group> </Card.Footer.Item>
    </Card>
  </Column>)
};

export default App;