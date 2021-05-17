import './App.css';
import React, {useEffect, useState} from "react";
import {BrowserRouter, Link, Route, Switch} from 'react-router-dom';
import {Button, Card, Nav, Toast} from 'react-bootstrap';
import RegisterPage from "./pages/RegisterPage";
import LoginPage from './pages/LoginPage';
import MyCoursesPage from './pages/MyCoursesPage';
import CreateCoursePage from './pages/CreateCoursePage';
import MainCoursePage from './pages/MainCoursePage';
import {NotificationContext} from "./services/NotificationContext";
import AuthService from "./services/AuthService";
import {AuthContext} from "./services/AuthContext";
import CustomNavbar from "./Navbar";
import PrivateRoute from "./PrivateRoute";
import ProfilePage from "./pages/ProfilePage";
import CreatorProfilePage from "./pages/CreatorProfilePage";
import MyCartPage from "./pages/MyCartPage";
import MyWishlistPage from "./pages/MyWishlistPage";
import CreateAnnouncementPage from "./pages/CreateAnnouncementPage";
import MyCertificatesPage from "./pages/MyCertificatesPage";
import AnswerQuestionPage from "./pages/AnswerQuestionPage";
import CreateDiscountPage from "./pages/CreateDiscountPage";
import StatisticsPage from "./pages/StatisticsPage";

import Homepage from "./pages/Homepage";
import CreateLecturePage from "./pages/CreateLecturePage";
import LecturePage from "./pages/LecturePage";
import AdminPage from "./pages/AdminPage";
import ChangeProfilePage from "./pages/ChangeProfile";
import CourseDescPage from "./pages/CourseDescPage";
import CreateQuizPage from "./pages/CreateQuizPage";
import MyRefundsPage from "./pages/MyRefundsPage";
import QuizPage from "./pages/QuizPage";
import {ManageDiscountsComp} from "./components/course_comps";
import MyNotificationPage from "./pages/MyNotificationPage";
import AboutUs from "./pages/AboutUsPage";
import MyBalance from "./pages/MyBalance";
import UpdateCoursePage from "./pages/UpdateCoursePage";

let timer = null;

function App() {
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("Processing");
    const [show, setShow] = useState(false);
    const [toastStyle, setToastStyle] = useState({});
    const [userRole, creatorRole, adminRole, anonRole] = [0, 1, 2, 3];

  return (
      <NotificationContext.Provider value={{
          setShow: (isShown)=>{
              console.log("Notification shown");
              setShow(isShown);
              if(timer){
                  clearTimeout(timer);
              }
              timer = setTimeout(()=>{
                  setShow(false);
                  console.log("Notification hided");
              }, 2000);
          },
          setIntent: (intent) => {
              switch (intent) {
                  case "success":
                      setToastStyle({backgroundColor: "rgb(200,255,200)"});
                      break;
                  case "failure":
                      setToastStyle({backgroundColor: "rgb(255,200,200)"});
                      break;
                  case "warning":
                      setToastStyle({backgroundColor: "rgb(255,230,210)"});
                      break;
                  default:
                      setToastStyle({});
              }
          },
          setContent: (title, content) =>{
              setTitle(title);
              setContent(content);
          }
      }}>
          <AuthContext.Provider value={{
              getHeader: ()=>{
                  const currentUser = AuthService.getCurrentUser();
                  if (currentUser && currentUser.token) {
                      return { Authorization: `Bearer ${currentUser.token}` };
                  } else {
                      return {};
                  }
              },
              getCurrentUser: AuthService.getCurrentUser(),
              isCreator: ()=>AuthService.isCreator(),
              isAdmin: ()=>AuthService.isAdmin(),
          }}>
              <BrowserRouter>
                  <div>
                      <Toast show={show} onClose={()=>setShow(false)} className="fixed-bottom ml-auto mr-5 mb-5">
                          <Toast.Header style={toastStyle}>
                              <strong className="mr-auto">{title}</strong>
                              <small>time: {new Date().toLocaleTimeString("tr")}</small>
                          </Toast.Header>
                          <Toast.Body>{content}</Toast.Body>
                      </Toast>
                      <CustomNavbar/>
                      <Switch>
                          <Route exact path='/' component={Homepage}/>
                          <PrivateRoute path='/my-courses' component={MyCoursesPage} role={[userRole, creatorRole]}/>
                          <PrivateRoute path='/course/:cid/create-quiz' component={CreateQuizPage} role={[creatorRole]}/>
                          <Route path='/course/:cid/quiz/:qid' component={QuizPage}/>
                          <PrivateRoute path='/course/:cid/lecture/:lid' component={LecturePage} role={[userRole]}/>
                          <PrivateRoute path='/course/:cid' component={MainCoursePage} role={[creatorRole, userRole]}/>
                          <PrivateRoute path='/create-course' component={CreateCoursePage} role={[creatorRole]}/>
                          <PrivateRoute path='/update-course/:cid' component={UpdateCoursePage} role={[creatorRole]}/>
                          <Route path='/course-desc/:cid' component={CourseDescPage} />
                          <Route path='/about' component={AboutUs}/>
                          <PrivateRoute path='/login' component={LoginPage} role={[anonRole]}/>
                          <PrivateRoute path='/profile' component={ProfilePage} role={[userRole, creatorRole, adminRole]}/>
                          <PrivateRoute path='/admin' component={AdminPage} role={[adminRole]}/>
                          <PrivateRoute path='/register' component={RegisterPage} role={[anonRole]}/>
                          <PrivateRoute path='/create-lecture/:cid' component={CreateLecturePage} role={[creatorRole]}/>
                          <PrivateRoute path='/manage-discounts/:cid' component={ManageDiscountsComp} role={[creatorRole]}/>
                          <Route path='/creator-profile/:creatorId' component={CreatorProfilePage} />
                          <PrivateRoute path='/my-refunds' component={MyRefundsPage} role={[userRole]}/>
                          <PrivateRoute path='/change-profile' component={ChangeProfilePage} role={[userRole, creatorRole]}/>
                          <PrivateRoute path='/my-notifications' component={MyNotificationPage} role={[userRole]}/>
                          <PrivateRoute path='/my-cart' component={MyCartPage} role={[userRole]}/>
                          <PrivateRoute path='/my-wishlist' component={MyWishlistPage} role={[userRole]}/>
                          <PrivateRoute path='/my-balance' component={MyBalance} role={[userRole]}/>
                          <PrivateRoute path='/my-certificates' component={MyCertificatesPage} role={[userRole]}/>
                          <PrivateRoute path='/create-announcement' component={CreateAnnouncementPage} role={[creatorRole]}/>
                          <PrivateRoute path='/create-discount-page' component={CreateDiscountPage} role={[adminRole]}/>
                          <Route path='/stats' component={StatisticsPage} role={[adminRole]}/>
                      </Switch>
                  </div>
              </BrowserRouter>
          </AuthContext.Provider>
      </NotificationContext.Provider>
  );
}

export default App;
