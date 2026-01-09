
export const FETCH_MENU_REQUEST = "FETCH_MENU_REQUEST";
export const FETCH_MENU_SUCCESS = "FETCH_MENU_SUCCESS";
export const FETCH_MENU_FAILURE = "FETCH_MENU_FAILURE";

// Initial State
const initialState = {
  menuItems: [],
  loading: false,
  error: null,
};

// Menu Reducer Function
const menuReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MENU_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_MENU_SUCCESS:
      return {
        ...state,
        loading: false,
        menuItems: action.payload,
        error: null,
      };

    case FETCH_MENU_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload, 
        menuItems: [],
      };

    default:
      return state;
  }
};

export default menuReducer;
