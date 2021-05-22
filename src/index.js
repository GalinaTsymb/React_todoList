import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";

import reducer from "./reducer";
import App from "./App";

// создание хранилища, reducer - обячная функция, папка reducer
const store = createStore(reducer);

//Provider - оборачиваем наш компонент в глобальное хранилище, store - хранилище
ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);
