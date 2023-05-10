
import './App.css';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Drawer from './components/Drawer';
import Header from './components/Header';
import React from 'react';
import axios from 'axios';
import {Route} from 'react-router-dom';
import AppContext from './context';



function App() {
   const [items, setItems] = React.useState([]);
   const [cartItems, setCartItems] = React.useState([]);
   const [favorites, setFavorites] = React.useState([]);
  
   
   const [cartOpened, setCartOpened] = React.useState(false);
   const [searchValue, setSearchValue] = React.useState('');
   const [isLoading, setIsLoading] = React.useState(true);


   React.useEffect(()=>{
    async function fetchData() {
     
      const cartResponse = await axios.get('https://6418af2575be53f451e53677.mockapi.io/cart') 
      const favoritesResponse = await axios.get('https://6437dbe5894c9029e8c8093d.mockapi.io/favorites') 
      const itemsResponse = await axios.get('https://6418af2575be53f451e53677.mockapi.io/items')
        
      setIsLoading(false);

      setCartItems(cartResponse.data);
      setFavorites(favoritesResponse.data);
      setItems(itemsResponse.data);
  }
  fetchData();

  }, []);



 const onAddToCart = (obj) => {
  console.log(obj);
    if(cartItems.find((item)=>Number(item.id) === Number(obj.id))) {
      axios.delete(`https://6418af2575be53f451e53677.mockapi.io/cart/${obj.id}`); 
    setCartItems((prev)=>prev.filter((item) => Number(item.id) !== Number(obj.id)));
   } else {
   axios.post('https://6418af2575be53f451e53677.mockapi.io/cart', obj);
  setCartItems((prev)=>[...prev, obj]);
   }
 };

 const onRemoveItem = (id) => {
   axios.delete(`https://6418af2575be53f451e53677.mockapi.io/cart/${id}`);
  setCartItems((prev) => prev.filter((item) => item.id !==id));

 };

 const onAddToFavorite = async (obj) => {
  try {
  if (favorites.find((favObj)=>Number(favObj.id) ===Number(obj.id))) {
    axios.delete(`https://6437dbe5894c9029e8c8093d.mockapi.io/favorites/${obj.id}`);
   
  } else {
   const {data} = await axios.post('https://6437dbe5894c9029e8c8093d.mockapi.io/favorites', obj);
    setFavorites((prev)=>[...prev, data]);
  }
  }catch(error) {
    alert('Не удалось добавить в фавориты');
  }

 };

 const onChangeSearchInput = (event) => {
   setSearchValue(event.target.value);
 }; 

 const isItemAdded = (id)=> {
  return cartItems.some((obj)=> Number(obj.id) === Number(id));
 };


  return (
    <AppContext.Provider value={{items, cartItems, favorites, isItemAdded, onAddToFavorite, setCartOpened, setCartItems}}>
      <div className="Wrapper clear">
     {cartOpened && <Drawer items={cartItems}  onClose={ () => setCartOpened(false) } onRemove={onRemoveItem} /> }

    <Header onClickCart={()=> setCartOpened(true)}/>

    <Route  path="/" exact> 
    <Home
     items={items} 
     cartItems={cartItems}
     searchValue={searchValue} 
    setSearchValue={setSearchValue}
    onChangeSearchInput={onChangeSearchInput}
    onAddToFavorite={onAddToFavorite}
    onAddToCart={onAddToCart}
    isLoading={isLoading}
    /> 
    
    </Route>
           
    <Route  path="/favorites" exact> 
    <Favorites 
   
    onAddToFavorite={onAddToFavorite}
    /> 
    
    </Route>     
      
        </div>
    </AppContext.Provider>
      
   
    
  );
}

export default App;
