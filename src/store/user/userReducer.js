const initialState = {
  user: null,
  name:"",
};


export const intialDetails = 
{
  
}

export const userReducer = (state=initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload,name: action.payload.displayName};
    case 'CLEAR_USER':
      return { ...state, user: null };
    default:
      return state;
  }
};

export const detailsReducer =  (state=intialDetails, action) =>
{
  switch (action.type) {
    case 'FETCH_START_DETAILS':
      return {isLoading : true}
    case 'FETCH_DETAILS':
      return action.payload
    default:
      return null;
  }
}