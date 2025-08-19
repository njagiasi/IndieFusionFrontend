import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AuthLayout from './AuthLayout/AuthLayout';
import { ToastContainer } from 'react-toastify';

import styles from "./App.css"



const LandingPage = lazy(() => import('./LandingPage/LandingPage'));
const Profile  = lazy(() => import('./Profile/profile'));
const Notifications = lazy(() => import('./pages/post-login/Notifications/Notifications'));
const LoginRegister = lazy(() => import('./LoginRegister/LoginRegister'));
const ForgotPasswordUI = lazy(() => import('./ForgotPassword/ForgotPasswordUI'));
const ResetPassword = lazy(() => import('./ResetPassword/ResetPassword'));
const Dashboard = lazy(() => import('./Dashboard/Dashboard'));
const Create = lazy(() => import('./Create/Create'))
const NotFound = lazy(() => import('./not-found/NotFound'));
const MyProfilePage = lazy(() => import('./MyProfilePage/MyProfilePage'));
const PreLoginLayout = lazy(() => import('./PreLoginLayout/PreLoginLayout'));
const Groups = lazy(() => import('./pages/post-login/Group/Group'));
const Events = lazy(() => import('./pages/post-login/Events/Events'));
const CollabRequest = lazy(() => import('./pages/post-login/CollabRequest/CollabRequest'));
const Details = lazy(() => import('./pages/post-login/Group/Details/Details'));
const Search=lazy(()=>import('./pages/post-login/Search/Search'));
const EventDetails=lazy(()=>import('./pages/post-login/Events/EventDetails/EventDetails')) ;

function App() {
  return (
    <div className={`${styles["main-background-color"]}`}>
      <ToastContainer />
      <HashRouter>
        <Suspense fallback={<span>Loading...</span>}>
          <Routes>

            <Route path='' element={<PreLoginLayout />}>
              <Route index element={<LandingPage />} />
              <Route path='login' element={<LoginRegister />} />
              <Route path='forgot-password' element={<ForgotPasswordUI />} />
            </Route>
            <Route path='' element={<AuthLayout />}>
              <Route index element={<Dashboard />} />
              <Route path='reset-password' element={<ResetPassword />} />
              <Route path='profile' element={<Profile />} />
              <Route path='dashboard' element={<Dashboard />} />
              <Route path='create' element={<Create />} />
              <Route path='edit/:postId' element={<Create />} />
              <Route path='my-profile-page' element={<MyProfilePage />} />
              <Route path='profile/:profileId' element={<MyProfilePage />} />
              <Route path='groups' element={<Groups />} />
              <Route path='events' element={<Events />} />
              <Route path='notifications' element={<Notifications />} />
              <Route path='collab-request' element={<CollabRequest />} />
              <Route path='groups/:groupId' element={<Details />} />
              <Route path='search' element={<Search />} />
              <Route path='events/:id' element={<EventDetails />} />
              <Route path='post/:id' element={<EventDetails />} />
            </Route>
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </div>
  );
}

export default App;
