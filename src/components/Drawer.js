import Info from "./Info";
import React from "react";

import axios from "axios";
import { useCart } from "../hooks/useCart";

const delay = (ms)=> new Promise((resolve)=> setTimeout(resolve, ms));

function Drawer({onClose, onRemove, items = [] }) {

  const {cartItems, setCartItems, totalPrice} = useCart();
  const [isOrderComplete, setIsOrderComplete] = React.useState(false);
  const [orderId, setOrderId] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  


  const onClickOrder = async  () => {
    try {
      setIsLoading(true);
      const{data} = await axios.post('https://645e5a5412e0a87ac0ee299a.mockapi.io/orders',{items: cartItems});
      
    setOrderId(data.id);
    setIsOrderComplete(true);
    setCartItems([]);
    for (let i=0; i < cartItems.length; i++) {
      const item=cartItems[i];
      await axios.delete('https://6418af2575be53f451e53677.mockapi.io/cart'+item.id);
      await delay(1000);
    }
      
    } catch (error) {
      alert('Не удалось создать заказ :(');
      
    }
    setIsLoading(false);
  }
    return(
        <div  className="overlay">
        

      <div className="drawer">
        <h2 className='d-flex justify-between mb-30'>
          Корзина <img onClick={onClose} className="cu-p" src="/img/btn-remove.svg" alt="Close"/>
          </h2>

          {
            items.length > 0 ? (
            <div className="d-flex flex-column flex">
               <div className="items">
            {
              items.map((obj)=>(
                <div key={obj.id} className="cartItem d-flex align-center mb-20">
           
         
                <div style={{backgroundImage:`url(${obj.imageUrl})`}} 
                className="cartItemImg"></div>
               
                <div className='mr-20 flex'>
                    <p className='mb-5'> {obj.title} </p>
                   <b> {obj.price} руб.</b>
              </div>
                   <img onClick={()=> onRemove(obj.id)} 
                   className='removeBtn' src="/img/btn-remove.svg" alt="Remove" />
              </div> ))  }
  
            </div>
            <div className='cartTotalBlock'>
            <ul>
               <li>
                 <span>Итого:</span>
                 <div> </div>
                 <b>{totalPrice} руб.</b>
               </li>
               <li>
                 <span>Налог 5%:</span>
                 <div></div>
                 <b>{totalPrice*5/100} руб.</b>
               </li>
             </ul>
             <button disabled={isLoading} onClick={onClickOrder} className='greenButton'>Оформить заказ <img src="/img/arrow.svg" alt="Arrow" />
             </button>
     </div>
     </div>
     )  :  (
           <Info
             title = {isOrderComplete ? "Заказ оформлен!" : "Корзина пустая "}
             description = {isOrderComplete ? `Ваш заказ #${orderId} скоро будет передан курьерской доставке` : "Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ."}
             image = { isOrderComplete ? "/img/complete-order.jpg" : "/img/empty-cart.jpg"}
           />
          )

          }

         
        



        
    </div>
    

     
           
       </div>
      
      
  );
    
}
export default Drawer;
