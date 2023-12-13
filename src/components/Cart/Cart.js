import React, { useContext, useState } from "react";
import classes from './cart.module.css';
import Modal from "../UI/Modal";
import CartContext from "../../store/cart-context";
import CartItem from "./CartItem";
import CheckOut from "./CheckOut";

const Cart = props => {

  const [isCheckOut, setIsCheckOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);

  const cartCtx = useContext(CartContext);
  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const removeItemHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const addItemHandler = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
  };

  const orderHandler = () => {
    setIsCheckOut(true);
  }

  const cartItems = (<ul className={classes['cart-items']}>
    {cartCtx.items.map(item => 
    <CartItem 
    key={item.id} 
    name={item.name} 
    price={item.price} 
    amount={item.amount}
    onRemove={removeItemHandler.bind(null, item.id)}
    onAdd={addItemHandler.bind(null, item)}
    />)}
    </ul>
  );

  const submitOrderHandler = async(userData) => {
    setIsSubmitting(true);
    await fetch('https://food-oreder-app-13586-default-rtdb.firebaseio.com/orders.json',{
      method: 'POST',
      body: JSON.stringify({
        user: userData,
        orderedItems: cartCtx.items
      }),
    })
    setIsSubmitting(false);
    setDidSubmit(true);
    cartCtx.clearCart();
  }

  const modalActions = 
    <div className={classes.actions}>
      <button className={classes['button--alt']} onClick={props.onClose}>Close</button>
      {hasItems && <button className={classes.button} onClick={orderHandler}>Order</button>}
    </div>

  const modalContent = 
    <React.Fragment>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckOut && <CheckOut onConfirm={submitOrderHandler} onCancel={props.onClose}/>}
      {!isCheckOut && modalActions}
    </React.Fragment>

  const didSubmitModalContent = (
    <React.Fragment>
      <p>Successfully sent the order!</p>
      <div className={classes.actions}>
      <button className={classes.button} onClick={props.onClose}>
        Close
      </button>
    </div>
    </React.Fragment>
  );

  return (
    <Modal onClose={props.onClose}>
      {!isSubmitting && !didSubmit && modalContent}
      {isSubmitting && <p>Sending Order Data...</p>}
      {!isSubmitting && didSubmit && didSubmitModalContent}
    </Modal>
  );
}

export default Cart;