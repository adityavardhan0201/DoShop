export const intialDetails = 
{
    shopData : null
}


export const productReducer = (state=intialDetails,action) =>
{
    if(action.type==="FETCH_ITEMS")
    {
        return {...state,shopData:action.payload}
    }
    else
    {
        return state;
    }
}