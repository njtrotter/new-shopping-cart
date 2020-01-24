import React, { useEffect, useState } from 'react';
import 'rbx/index.css';
import { Button, Card, Container, Column } from 'rbx';
import Sidebar from 'react-sidebar';
import firebase from 'firebase/app';
import 'firebase/database';

var firebaseConfig = {
  apiKey: "AIzaSyAHQqR3gafeRU--l2UxBZHghg8NzgxeWQA",
  authDomain: "new-shopping-1232f.firebaseapp.com",
  databaseURL: "https://new-shopping-1232f.firebaseio.com",
  projectId: "new-shopping-1232f",
  storageBucket: "new-shopping-1232f.appspot.com",
  messagingSenderId: "783985721956",
  appId: "1:783985721956:web:b0be5b26866330db871571"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref();

const useCartProducts = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const addProductToCart = (p, size) => {
    setCartProducts(
      cartProducts.find(product => product.sku === p.sku && product.size === size) ?
        cartProducts.map(product =>
          product.sku === p.sku && product.size === size ?
            { ...product, quantity: product.quantity + 1 }
            :
            product
        )
        :
        [{ ...p, size, quantity: 1 }].concat(cartProducts)
    );
  }
  const removeProductFromCart = (p, size) => {
    setCartProducts(
      cartProducts.map(product =>
        product.sku === p.sku && product.quantity > 0 ?
          { ...product, quantity: product.quantity - 1 }
          :
          product
      ) 
    );
  }
  
  return [cartProducts, addProductToCart, removeProductFromCart];
}

const App = () => {
  const [data, setData] = useState({});
  const [inventory, setInventory] = useState(false);
  //state for shopping cart, initially set to closed
  const [shopingCartOpen, setShoppingCartOpen] = useState(false);
  const products = Object.values(data);
  const [cartProducts, addProductToCart, removeProductFromCart] = useCartProducts();
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('/data/products.json');
      const json = await response.json();
      setData(json);
    };
    const fetchProductInventory = snap => {
        if (snap.val()) setInventory(snap.val());
      }
    db.on('value', fetchProductInventory, error => alert(error));
    fetchProducts();
    return () => { db.off('value', fetchProductInventory); };
  }, []);
  return (
    <Sidebar
      sidebar={<ShoppingCart
        cartProducts={cartProducts}removeProductFromCart={removeProductFromCart} />}
      open={shopingCartOpen}
      onSetOpen={setShoppingCartOpen}
      pullRight
  >
    <Container>
      <Button onClick={() => setShoppingCartOpen(true)}>
           Open Shopping Cart
         </Button>

      <Column.Group multiline={true}>
        {!inventory ? "Loading inventory..." : 
        products.map(product => <Product key={product.sku} product={product} inventory={inventory} addProductToCart={addProductToCart}></Product>)}
      </Column.Group>
    </Container>
  </Sidebar>
  );
};
const Product = ({product, inventory, addProductToCart}) => {
  const [productSize, setSize] = useState("");
  return (
  <Column size={4}>
    <Card>
      <Card.Header>{product.title}</Card.Header>
      <Card.Image><img src={`/data/products/${product.sku}_2.jpg`} alt="product"/></Card.Image>
      <Card.Content>{product.description}</Card.Content>
      <Card.Footer>{product.currencyFormat}{product.price}</Card.Footer>
        <Card.Footer.Item>
        {!inventory ? "Loading inventory..." : 
          inventory[product.sku]["S"] === 0 && inventory[product.sku]["S"] !== 0 && inventory[product.sku]["S"] !== 0 && inventory[product.sku]["S"] !== 0 ?
          "No Products Available" :
          <Button.Group>
            {inventory[product.sku]["S"] !== 0 ? (
              <SizeSelectorButton setSize={setSize} selectedSize={productSize} size="S" />
            ) : null}
            {inventory[product.sku]["M"] !== 0 ? (
              <SizeSelectorButton setSize={setSize} selectedSize={productSize} size="M" />
            ) : null}
            {inventory[product.sku]["L"] !== 0 ? (
              <SizeSelectorButton setSize={setSize} selectedSize={productSize} size="L" />
            ) : null}
            {inventory[product.sku]["XL"] !== 0 ? (
              <SizeSelectorButton setSize={setSize} selectedSize={productSize} size="XL" />
            ) : null}
            <Button onClick={() => productSize ? addProductToCart(product, productSize) : alert("You need to choose your product size!")}>
                      Add to Cart!</Button>
          </Button.Group> 
          
        }     
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
const ShoppingCart = ({ cartProducts, removeProductFromCart }) => {
  console.log(cartProducts);
  return (
      <Card>
          <Card.Header >
              Cart
          </Card.Header>
          <Card.Content>
              {cartProducts.map(product =>
                  <ShoppingCartProduct
                      key={product.sku}
                      product={product}
                      removeProductFromCart={removeProductFromCart}
                      />
              )}
              <p>Subtotal: {cartProducts.reduce((total, p) => total + p.price * p.quantity, 0)}</p>
              <Button>Checkout</Button>
          </Card.Content>
      </Card>
  );
}
const ShoppingCartProduct = ({product, removeProductFromCart}) => {
  return (
    <Card>
      <Card.Header>{product.title}</Card.Header>
      <Card.Image><img src={`/data/products/${product.sku}_2.jpg`} alt="product"/></Card.Image>
      <Card.Content>{product.description}</Card.Content>
      <Card.Footer>{product.currencyFormat}{product.price}</Card.Footer>
      <Card.Footer>Quantity: {product.quantity}</Card.Footer>
      <Card.Footer>Size: {product.size}</Card.Footer>
      <Card.Footer.Item>
        <Button onClick={() => removeProductFromCart(product, product.size)}>
                      Remove From Cart</Button>
                      </Card.Footer.Item>
    </Card>
  );
}
export default App;