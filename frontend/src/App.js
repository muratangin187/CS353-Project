import './App.css';
import {useEffect, useState} from "react";
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
import AnswerQuestionPage from "./pages/AnswerQuestionPage";
import CreateDiscountPage from "./pages/CreateDiscountPage";

import Homepage from "./pages/Homepage";
import CreateLecturePage from "./pages/CreateLecturePage";
import LecturePage from "./pages/LecturePage";
import AdminPage from "./pages/AdminPage";
import CourseDescPage from "./pages/CourseDescPage";
import CreateQuizPage from "./pages/CreateQuizPage";
import MyRefundsPage from "./pages/MyRefundsPage";
import AboutUs from "./pages/AboutUsPage";

let timer = null;

function App() {
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("Processing");
    const [show, setShow] = useState(false);
    const [toastStyle, setToastStyle] = useState({});

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
                          <Route path='/courses' component={Api}/>
                          <Route path='/my-courses' component={MyCoursesPage}/>
                          <Route path='/course/:cid/create-quiz' component={CreateQuizPage}/>
                          <Route path='/course/:cid/lecture/:lid' component={LecturePage}/>
                          <Route path='/course/:cid' component={MainCoursePage}/>
                          <Route path='/create-course' component={CreateCoursePage}/>
                          <Route path='/course-desc/:cid' component={CourseDescPage}/>
                          <Route path='/about' component={AboutUs}/>
                          <Route path='/login' component={LoginPage}/>
                          <PrivateRoute path='/profile' component={ProfilePage} role={0}/>
                          <PrivateRoute path='/admin' component={AdminPage} role={2}/>
                          <Route path='/register' component={RegisterPage}/>
                          <Route path='/create-lecture/:cid' component={CreateLecturePage}/>
                          <Route path='/creator-profile/:creatorId' component={CreatorProfilePage}/>
                          <Route path='/my-cart/:userId' component={MyCartPage}/>
                          <Route path='/my-wishlist/:userId' component={MyWishlistPage}/>
                          <Route path='/my-refunds' component={MyRefundsPage}/>
                          <Route path='/my-cart' component={MyCartPage}/>
                          <Route path='/my-wishlist' component={MyWishlistPage}/>
                          <Route path='/create-announcement/:creatorId' component={CreateAnnouncementPage}/>
                          <Route path='/answer-question-page/:questionId' component={AnswerQuestionPage}/>                          <Route path='/answer-question-page/:questionId' component={AnswerQuestionPage}/>
                          <Route path='/create-discount-page' component={CreateDiscountPage}/>

                      </Switch>
                  </div>
              </BrowserRouter>
          </AuthContext.Provider>
      </NotificationContext.Provider>
  );
}

function Api(){
    const [test, setTest] = useState("");

    useEffect(()=>{
        fetch("/api/user/login").then((res)=>{
            res.json().then(data=>{
                setTest(data.api);
            });
        });
    });
    return (
        <div className="App">
            <h1>Api</h1>
            <h2>{test}</h2>
        </div>
    );
}


export default App;
