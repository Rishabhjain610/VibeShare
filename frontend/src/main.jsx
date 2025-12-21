import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AuthContext from "./context/AuthContext.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import StoryContext from "./context/StoryContext.jsx";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <AuthContext>
        <StoryContext>
          <App />
        </StoryContext>
      </AuthContext>
    </Provider>
  </BrowserRouter>
);
