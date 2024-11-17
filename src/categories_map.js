import { Outlet } from 'react-router-dom';
import Category from './Categories';
import mens from './images/seriously-man-black-near-gray-background.jpg';
import './container.css';

const Categories  = 
[
  {
    name:"Hats",
    id:1,
    imageUrl: 'https://i.ibb.co/cvpntL1/hats.png',
  },
  {
    name:"Jacket",
    id:2,
    imageUrl: 'https://i.ibb.co/px2tCc3/jackets.png',
  },
  {
    name:"Sneakers",
    id:3,
    imageUrl: 'https://i.ibb.co/0jqHpnp/sneakers.png',
  },
  {
    name:"Womens",
    id:4,
    imageUrl: 'https://i.ibb.co/GCCdy8t/womens.png',
  },
  {
    name:"Mens",
    id:5,
    imageUrl: mens
  }
]
const Catmap= () => 
{
    
    return(
        <div><Outlet/>
        <div className='Outer_container'>
            {Categories.map((maps) =>
              {
                return(
                  <Category  key={maps.id} name={maps.name} imageUrl={maps.imageUrl}/>
              )})}
        </div>
        </div>
    )
}
 export default Catmap;