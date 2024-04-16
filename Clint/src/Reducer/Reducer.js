import { combineReducers } from 'redux';
import { setUpdateStatus, setCustomer } from '../Actions/Actions'; 
// Define initial state for customer reducer
const initialCustomerState = {
  customers: [],
  loading: true,
  error: null,
  paymentDetails: null,
};

// Customer reducer
const customerReducer = (state = initialCustomerState, action) => {
  switch (action.type) {
    case 'SET_CUSTOMERS':
      return {...state, customers: action.payload, loading: false };
    case 'SET_ERROR':
      return {...state, error: action.payload, loading: false };
    case 'SET_PAYMENT_DETAILS':
      return {...state, paymentDetails: action.payload, loading: false };
    case 'CLEAR_ERROR':
        return { ...state, error: null };
    case 'SET_SUCCESS_MESSAGE':
          return { ...state, successMessage: action.payload };
    case 'UPDATE_CUSTOMER':
            const updatedCustomers = state.customers.map(customer => {
                if (customer.id === action.payload.customerId) {
                    return { ...customer, ...action.payload.updatedDetails };
                }
                return customer;
            });
    case 'DELETE_CUSTOMER':
              const filteredCustomers = state.customers.filter(customer => customer.id !== action.payload);
              return { ...state, customers: filteredCustomers };
            return { ...state, customers: updatedCustomers };
    default:
        return state;
  }
};

// Reducer for general loading state
const loadingReducer = (state = true, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return action.payload;
    default:
      return state;
  }
};

// Combine reducers
const rootReducer = combineReducers({
  customer: customerReducer,
  loading: loadingReducer, // Add loading reducer to manage loading state globally
  // Add more reducers here if needed
});

export default rootReducer;