import { createStore } from "redux";
import counterReducer from "../../features/contact/counterReducer";

const cofigureStore = () => {
  return createStore(counterReducer);
};

export default cofigureStore;
