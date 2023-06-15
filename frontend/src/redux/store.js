import { createStore, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import reducer, { initialState } from "./reducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage

const persistConfig = {
  key: "trend_link_news",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);

let store = createStore(
  persistedReducer,
  initialState,
  applyMiddleware(reduxThunk)
);
let persistor = persistStore(store);

export { store, persistor };
