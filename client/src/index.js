import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import App from './App';
import Chat from './pages/chat';
import About from './pages/about';

ReactDOM.render(

    <BrowserRouter>
        <Routes>
            <Route path={"/"} element={<App/>}/>
            <Route path={"/about"} element={<About/>}/>
            <Route path={"/chat"} element={<Chat/>}/>
        </Routes>
    </BrowserRouter>,

    document.getElementById('root'));