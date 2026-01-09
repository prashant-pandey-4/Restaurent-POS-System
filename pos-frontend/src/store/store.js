import { createStore, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk";
import menuReducer from "./reducers/menuReducer";
import orderReducer from "./reducers/orderReducer";

const rootReducer = combineReducers({
  menu: menuReducer,
  order: orderReducer,
});

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;