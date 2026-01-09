// Order Action Types
export const ADD_ITEM_TO_CART = "ADD_ITEM_TO_CART";
export const REMOVE_ITEM_FROM_CART = "REMOVE_ITEM_FROM_CART";
export const INCREASE_ITEM_QUANTITY = "INCREASE_ITEM_QUANTITY";
export const DECREASE_ITEM_QUANTITY = "DECREASE_ITEM_QUANTITY";
export const CLEAR_CART = "CLEAR_CART";

// Action Creators
export const addItemToCart = (item) => ({
  type: ADD_ITEM_TO_CART,
  payload: item,
});

export const removeItemFromCart = (id) => ({
  type: REMOVE_ITEM_FROM_CART,
  payload: id,
});

export const increaseItemQuantity = (id) => ({
  type: INCREASE_ITEM_QUANTITY,
  payload: id,
});

export const decreaseItemQuantity = (id) => ({
  type: DECREASE_ITEM_QUANTITY,
  payload: id,
});

export const clearCart = () => ({
  type: CLEAR_CART,
});
