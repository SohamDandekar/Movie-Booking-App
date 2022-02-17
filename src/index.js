import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'typeface-roboto';
import registerServiceWorker from './registerServiceWorker';
import { Header } from './common/header/Header';
import Home from './screens/home/Home';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookShow from './screens/bookshow/BookShow';
import { Details } from './screens/details/Details';

ReactDOM.render(
    <Router>
      <React.StrictMode>
        <Routes>
          <Route exact path="/" element = {<Home/>}></Route>
          <Route exact path="/details/:movieId" element = {<Details/>}></Route>
          <Route exact path="/bookshow" element = {<BookShow/>}></Route>
        </Routes>
      </React.StrictMode>
    </Router>,
    document.getElementById('root')
  );
registerServiceWorker();
