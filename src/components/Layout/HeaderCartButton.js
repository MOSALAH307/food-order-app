import React, { useContext, useState, useEffect } from "react";
import classes from './HeaderCartButton.module.css';
import CartIcon from '../Cart/CartIcon';
import CartContext from "../../store/cart-context";

const HeaderCartButton = props => {

  const cartCtx = useContext(CartContext);

  const { items } = cartCtx;

  const [btnIsHighLighted, setBtnIsHighLighted] = useState(false);
  useEffect(() => {
    if (items.length === 0) {
      return;
    };
    setBtnIsHighLighted(true);
    const timer = setTimeout(() => {setBtnIsHighLighted(false)}, 300)
    return () => {
      clearTimeout(timer)
    };
  }, [items])

  const numberOfCartItems = cartCtx.items.reduce((currNumber, item) => {
    return currNumber + item.amount
  }, 0)

  const btnclasses =  `${classes.button} ${btnIsHighLighted ? classes.bump : ''}`;


  return (
    <button className={btnclasses} onClick={props.onClick}>
      <span className={classes.icon}>
        <CartIcon />
      </span>
      <span>Your Cart</span>
      <span className={classes.badge}>{numberOfCartItems}</span>
    </button>
  );
}

export default HeaderCartButton;