import { Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.scss';
import ReactNotification from 'react-notifications-component';
import ReactSpinner from './components/Spinners/ReactSpinner';
import AccountManagementScreen from './screens/admin/AccountManagementScreen/AccountManagementScreen';
import MusicManagementScreen from './screens/admin/MusicManagementScreen/MusicManagementScreen';
import ContactManagementScreen from './screens/admin/ContactManagementScreen.jsx/ContactManagementScreen';
import LoginAdminScreen from './screens/admin/LoginAdminScreen/LoginAdminScreen';
import ReactPageNotFound from './screens/PageNotFound/ReactPageNotFound';
import SideBar from './components/SideBarAdmin/SideBar';
import { useSelector } from 'react-redux';
import HomeScreen from './screens/user/HomeScreen/HomeScreen';
import HeaderUser from './components/HeaderUser/HeaderUser';
import FooterUser from './components/FooterUser/FooterUser';
import CategoryScreen from './screens/user/CategoryScreen/CategoryScreen';
import ReactListenMusic from './components/ListenMusic/ReactListenMusic';
import ContactScreen from './screens/user/ContactScreen/ContactScreen';
import AdminInfoScreen from './screens/admin/AdminInfoScreen/AdminInfoScreen';
import LoginScreen from './screens/user/LoginScreen/LoginScreen';
import RegisterScreen from './screens/user/RegisterScreen/RegisterScreen';
import AccountUserScreen from './screens/user/AccountUserScreen/AccountUserScreen';
import ChangePasswordScreen from './screens/user/ChangePasswordScreen/ChangePasswordScreen';
import UpdateInfoScreen from './screens/user/UpdateInfoScreen/UpdateInfoScreen';


const App = () => {

  const { musicState: { forceMusic } } = useSelector(state => {
    return { musicState: state.musicState };
  })

  // const [currMusic, setCurrMusic] = useState(null);

  // const { musicState: {playing}} = useSelector(state => {
  //   return { musicState: state.musicState };
  // });

  // useEffect(() => {
  //   setCurrMusic(playing)
  // }, [playing])


  return(
    <Suspense fallback="">
      <BrowserRouter>
        <ReactNotification isMobile={true} breakpoint={500}/>
        <ReactSpinner/>
        {forceMusic !== null && <ReactListenMusic/>}
        <Routes>
          <Route path="/admin">
            <Route path="account" element={
            <>
              <SideBar/>
              <AccountManagementScreen/>
            </>}/>
            <Route path="music" element={
            <>
              <SideBar/>
              <MusicManagementScreen/>
            </>
            }/>
            <Route path="contact" element={
            <>
              <SideBar/>
              <ContactManagementScreen/>
            </>}/>
            <Route path="login" element={<LoginAdminScreen/>}/>
            <Route path="home" element={
            <>
              <SideBar/>
              <AdminInfoScreen/>
            </>
            }/>
            <Route index element={<Navigate to={'home'}/>}/>
          </Route>
          <Route path="/">
            <Route path="the-loai/:slugCategory" element={
              <>
              <HeaderUser/>
              <CategoryScreen/>
              <FooterUser/>
            </>
            }/>
            <Route path="contact" element={
              <>
              <HeaderUser/>
              <ContactScreen/>
              <FooterUser/>
            </>
            }/>
            <Route path="user_info" element={
              <>
              <HeaderUser/>
              <AccountUserScreen />
              <FooterUser/> 
            </>
            }/>
            <Route path="change_password" element={
              <>
              <HeaderUser/>
              <ChangePasswordScreen />
              <FooterUser/>
            </>
            }/>
            <Route path="update_user_info" element={
              <>
              <HeaderUser/>
              <UpdateInfoScreen />
              <FooterUser/>
            </>
            }/>
            <Route path="login" element={
              <>
              <HeaderUser/>
              <LoginScreen/>
              <FooterUser/>
            </>
            }/>
            <Route path="register" element={
              <>
              <HeaderUser/>
              <RegisterScreen/>
              <FooterUser/>
            </>
            }/>
            <Route index element={
            <>
              <HeaderUser/>
              <HomeScreen/>
              <FooterUser/>
            </>
            } />
          </Route>
          <Route path="*" element={<ReactPageNotFound/>} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  )
}


export default App;
