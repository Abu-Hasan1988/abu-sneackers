
import React from 'react';
import Card from '../components/Card'; 
import axios from 'axios';
import AppContext from '../context';



function Orders()  
    { 
      const {onAddToFavorite, onAddToCart} = React.useContext(AppContext);
      const [orders, setOrders] = React.useState([]);
      const [isLoading, setIsLoading] = React.useState(true);
      

      React.useEffect(()=> {
        (async () => {
       try { 
        const {data} = await axios.get('https://645e5a5412e0a87ac0ee299a.mockapi.io/orders');
        setOrders(data.reduce((prev,obj)=>[...prev, ...obj.items], []));
        setIsLoading(false);
        
        
       } catch (error) {
        // alert('Ошибка');
        // console.error(error);
       }
      })();
    }, []);
       
    return(
        <div className="content p-40">
        <div className='d-flex align-center  justify-between mp-40'>
          <h1> Мои заказы </h1>
       
        </div>

        <div className="d-flex flex-wrap">

          

        {(isLoading ? [...Array(8)] : orders).map((item, index)=>( 
          <Card  key={index}
                 
          loading={isLoading}
          {...item}
          /> 
          ))}
          
          
          
          </div>
        </div>
    );
}

export default Orders;
