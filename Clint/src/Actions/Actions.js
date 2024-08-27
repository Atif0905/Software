
export const setCustomers = (customers) => ({
    type: 'SET_CUSTOMERS',
    payload: customers,
  });
  
  export const setError = (error) => ({
    type: 'SET_ERROR',
    payload: error,
  });
export const setLoading = (isLoading) => ({
  type: 'SET_LOADING',
  payload: isLoading,
});

export const setPaymentDetails = (paymentDetails) => {
  return {
    type: 'SET_PAYMENT_DETAILS',
    payload: paymentDetails,
  };
};
export const clearError = () => ({
  type: 'CLEAR_ERROR',
});
