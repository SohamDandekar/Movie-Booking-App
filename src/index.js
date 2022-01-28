import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'typeface-roboto';
import registerServiceWorker from './registerServiceWorker';
import { Header } from './common/header/Header';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookShow from './screens/bookshow/BookShow';

ReactDOM.render(
    <Router>
      <React.StrictMode>
        <Routes>
          <Route exact path="/" element = {<Header pageName = "Home"/>}></Route>
          <Route exact path="/details/:movieId" element = {<Header pageName = "Details"/>}></Route>
          <Route exact path="/bookshow" element = {<BookShow/>}></Route>
        </Routes>
      </React.StrictMode>
    </Router>,
    document.getElementById('root')
  );
registerServiceWorker();
