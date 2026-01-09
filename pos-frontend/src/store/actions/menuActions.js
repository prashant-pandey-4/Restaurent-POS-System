import axios from "axios";
import {
  FETCH_MENU_REQUEST,
  FETCH_MENU_SUCCESS,
  FETCH_MENU_FAILURE,
} from "../reducers/menuReducer";

export const fetchMenu = () => async (dispatch) => {
    try {
        
        dispatch({ type: FETCH_MENU_REQUEST });

        const { data } = await axios.get('https://restaurent-pos-system.onrender.com');

        
        const payload = data.menuItems ? data.menuItems : data;

        dispatch({
            type: FETCH_MENU_SUCCESS,
            payload: payload
        });
    } catch (error) {
        dispatch({
            type: FETCH_MENU_FAILURE,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};
