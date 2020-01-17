import React, { useEffect, useState } from 'react';
import 'rbx/index.css';
import { Button, Card, Container, Column } from 'rbx';

//keeps track of products in cart and addition of new products
//TODO: add removal of items in cart
const useCartProducts = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const addProductToCart = (p, size) => {
    setCartProducts(
      cartProducts.find(product => product.sku === p.sku) ?
        cartProducts.map(product =>
          product.sku === p.sku ?
            { ...product, quantity: product.quantity + 1 }
            :
            product
        )
        :
        [{ ...p, size, quantity: 1 }].concat(cartProducts)
    );
  }
  
  return [cartProducts, addProductToCart];
}

const App = () => {
  const [data, setData] = useState({});
  //state for shopping cart, initially set to closed
  const [shoopingCartOpen, setShoppingCartOpen] = useState(false);
  const products = Object.values(data);
  const [cartProducts, addProductToCart] = useCartProducts();
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
    <Container>
      <Button onClick={() => setShoppingCartOpen(true)}>
           Open Shopping Cart
         </Button>

      <Column.Group multiline={true}>
        {products.map(product => <Product product={product} addProductToCart={addProductToCart}></Product>)}
      </Column.Group>
    </Container>
  );
};

const Product = ({product, addProductToCart}) => {
  const [productSize, setSize] = useState("");
  return (
  <Column size={4}>
    <Card>
      <Card.Header>{product.title}</Card.Header>
      <Card.Image><img src={`/data/products/${product.sku}_2.jpg`} alt="product"/></Card.Image>
      <Card.Content>{product.description}</Card.Content>
  <Card.Footer>{product.currencyFormat}{product.price}</Card.Footer>
      <Card.Footer.Item>
        <Button.Group>
          <SizeSelectorButton setSize={setSize} selectedSize={productSize} size="S" />
          <SizeSelectorButton setSize={setSize} selectedSize={productSize} size="M" />
          <SizeSelectorButton setSize={setSize} selectedSize={productSize} size="L" />
          <SizeSelectorButton setSize={setSize} selectedSize={productSize} size="XL" />
          <Button onClick={() => productSize ? addProductToCart(product, productSize) : alert("You need to choose your product size!")}>
                     Add to Cart!</Button>
        </Button.Group> 
      </Card.Footer.Item>
    </Card>
  </Column>)
};

const SizeSelectorButton = ({ setSize, selectedSize, size }) => {
  return (
      size === selectedSize ?
          <Button color="primary" onClick={() => setSize(size)}>
              {size}
          </Button>
          :
          <Button onClick={() => setSize(size)}>
              {size}
          </Button>

  );
}

const ShoppingCart = ()=> {
  //const { shoppingCart, open, setOpen } = useContext(ShoppingCartContext);
//return()
};

export default App;