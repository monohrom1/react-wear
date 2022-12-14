import './App.scss';
import Header from "./Components/Header/Header";
import RightBar from "./Components/RightBar/RightBar";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Route, Routes} from "react-router-dom";
import Home from "./Pages/Home";
import Favorite from "./Pages/Favorite";


function App() {
    const [items, setItems] = useState([])
    const [cartItems, setCartItems] = useState([])
    const [favoriteItems, setFavoriteItems] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [cartOpen, setCartOpen] = useState(false)


    useEffect(() => {
        axios.get('https://6352a192a9f3f34c3744fa0c.mockapi.io/items')
            .then(response => {
                setItems(response.data)
            })
        axios.get('https://6352a192a9f3f34c3744fa0c.mockapi.io/cart')
            .then(response => {
                setCartItems(response.data)
            })
        axios.get('https://6352a192a9f3f34c3744fa0c.mockapi.io/favorites')
            .then(response => {
                setFavoriteItems(response.data)
            })
    }, [])

    const addToCart = (obj) => {
        if (cartItems.find((items) => Number(items.id) === Number(obj.id))) {
            axios.delete(`https://6352a192a9f3f34c3744fa0c.mockapi.io/cart/${obj.id}`)
            setCartItems((prev) => prev.filter(items =>Number(items.id) !== Number(obj.id)))
        } else {
            axios.post('https://6352a192a9f3f34c3744fa0c.mockapi.io/cart', obj)
            setCartItems((prev) => [...prev,obj])
        }

    }

    const onChangeSearch = (event) => {
        setSearchValue(event.target.value)
    }

    const onDeleteItems = (id) => {
        axios.delete(`https://6352a192a9f3f34c3744fa0c.mockapi.io/cart/${id}`)
        setCartItems((prev) => prev.filter(items => items.id !== id))
    }


    const addToFavorite = async (obj) => {
        try { //Проверка на ошибку, try- выполни это действие если не выполниться то выполни catch
            if (favoriteItems.find((favObj) => favObj.id === obj.id)) {
                axios.delete(`https://6352a192a9f3f34c3744fa0c.mockapi.io/favorites/${obj.id}`)
                setFavoriteItems((prev) => prev.filter(items => items.id !== obj.id))
            } else {
                const {data} = await axios.post('https://6352a192a9f3f34c3744fa0c.mockapi.io/favorites', obj)
                setFavoriteItems(prev => [...prev, data])
            }
        } catch (error) {
            alert('Не удалось добавить')
        }
    }

    return (
        <div className='wrapper clear'>
            {cartOpen &&
                <RightBar onClickDelete={onDeleteItems} items={cartItems} onClickClose={() => {
                    setCartOpen(false)
                }}/>}
            <Header onClickOpen={() => {
                setCartOpen(true)
            }}/>
            <Routes>
                <Route path="/" element={<Home items={items} searchValue={searchValue}
                                               setSearchValue={setSearchValue} onChangeSearch={onChangeSearch}
                                               addToFavorite={addToFavorite} addToCart={addToCart}/>}/>
                <Route path='/favorites' element={<Favorite items={favoriteItems}
                                                            addToFavorite={addToFavorite}
                                                            addToCart={addToCart}/>}/>
            </Routes>
        </div>


    );
}

export default App;










