export const ADD_ITEM_TO_CART = "ADD_ITEM_TO_CART";
export const REMOVE_ITEM_FROM_CART = "REMOVE_ITEM_FROM_CART";
export const INCREASE_ITEM_QUANTITY = "INCREASE_ITEM_QUANTITY";
export const DECREASE_ITEM_QUANTITY = "DECREASE_ITEM_QUANTITY";
export const CLEAR_CART = "CLEAR_CART";

const initialState = {
  cartItems: [],
  subTotal: 0,
  taxAmount: 0,
  totalAmount: 0,
};

const calculateTotals = (items) => {
  const newSubTotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const taxRate = 0.05;
  const newTaxAmount = newSubTotal * taxRate;
  const newTotalAmount = newSubTotal + newTaxAmount;

  return {
    subTotal: newSubTotal,
    taxAmount: newTaxAmount,
    totalAmount: newTotalAmount,
  };
};

export const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ITEM_TO_CART: {
      const newItem = action.payload;
      const existItem = state.cartItems.find((x) => x._id === newItem._id);

      let updatedCartItems;

      if (existItem) {
        updatedCartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? { ...x, quantity: x.quantity + 1 } : x
        );
      } else {
        updatedCartItems = [
          ...state.cartItems,
          {
            ...newItem,
            quantity: 1,
          },
        ];
      }

      const totals = calculateTotals(updatedCartItems);

      return {
        ...state,
        cartItems: updatedCartItems,
        ...totals,
      };
    }

    case INCREASE_ITEM_QUANTITY:
    case DECREASE_ITEM_QUANTITY: {
      const id = action.payload;

      let updatedItems = state.cartItems.map((item) => {
        if (item._id === id) {
          const newQuantity =
            action.type === INCREASE_ITEM_QUANTITY
              ? item.quantity + 1
              : item.quantity - 1;

          return { ...item, quantity: newQuantity > 0 ? newQuantity : 0 };
        }
        return item;
      });

      updatedItems = updatedItems.filter((item) => item.quantity > 0);

      const totals = calculateTotals(updatedItems);

      return {
        ...state,
        cartItems: updatedItems,
        ...totals,
      };
    }

    case REMOVE_ITEM_FROM_CART: {
      const id = action.payload;
      const updatedItems = state.cartItems.filter((item) => item._id !== id);
      const totals = calculateTotals(updatedItems);

      return {
        ...state,
        cartItems: updatedItems,
        ...totals,
      };
    }

    case CLEAR_CART:
      return initialState;

    default:
      return state;
  }
};

export default orderReducer;