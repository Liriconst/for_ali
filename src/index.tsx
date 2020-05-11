import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import "antd/dist/antd.css";
import ApolloClient from "apollo-boost";
import App from './App';
import * as serviceWorker from './serviceWorker';

export const client = new ApolloClient({
    // uri: "https://48p1r2roz4.sse.codesandbox.io"
    uri: "http://localhost:5000/graphql"
});

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();