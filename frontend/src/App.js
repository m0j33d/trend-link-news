import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ThreeDots } from 'react-loader-spinner'
import { Suspense, lazy } from "react";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";

import { persistor, store } from "./redux/store";
import { authService } from "./utils/utils";

import AlertBar from "./components/global/AlertBar"


//Pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Feed = lazy(() => import("./pages/NewsFeed"));
const Settings = lazy(() => import("./pages/Settings"));
const PageNotFound = lazy(() => import("./pages/404"));

// Axios interceptors
authService();

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Suspense fallback={<section className='w-screen my-64 flex justify-center'>
                <ThreeDots
                    height="80"
                    width="80"
                    radius="9"
                    color="#015BB5"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClassName="loader"
                    visible={true}
                />
            </section>
        }>
          <AlertBar />
          <Router>
            <div className="App">
              <Routes>
                <Route
                  exact
                  path="/"
                  element={<Navigate replace to="/sign-in" />}
                />
                <Route
                  exact
                  path="/sign-in"
                  element={<Login />}
                />
                <Route
                  exact
                  path="/sign-up"
                  element={<Register />}
                />
                <Route
                  path="/forgot-password"
                  element={<ForgotPassword />}
                />

                <Route
                  path="/password-reset/:token"
                  element={<ResetPassword />}
                />

                {/* Auth routes */}
                <Route
                  exact
                  path="/feed"
                  element={<Feed />}
                />
                <Route
                  exact
                  path="/profile-settings"
                  element={<Settings />}
                />

                {/* No match */}
                <Route path='*' element={<PageNotFound />} />
              </Routes>
            </div>
          </Router>
        </Suspense>
      </PersistGate>
    </Provider>
  )
}

export default App;
