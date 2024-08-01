import { createStore } from 'redux';

const initialState = {
  customers: [],
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_CUSTOMER':
      return {
        ...state,
        customers: [...state.customers, action.payload],
      };
    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.map((customer, index) =>
          index === action.payload.index ? action.payload.customer : customer
        ),
      };
    case 'DELETE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.filter((_, index) => index !== action.payload),
      };
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;
