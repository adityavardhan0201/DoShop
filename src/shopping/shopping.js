import { useContext } from "react";
import { ProductContext } from "../context/product_provider";
import ShopingMap from './ShopingMap'
import { useSelector } from 'react-redux';
const Shoping = () =>
{
    const {shopData} = useContext(ProductContext);
    const {shopDat} = useSelector(((state) => state.shopData))
    return(
        <div className="Navbelow">
            <ShopingMap shopData={shopData} />
        </div>
    )
}
export default Shoping;