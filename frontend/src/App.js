import './App.css';
import {useEffect, useState} from "react";
import {BrowserRouter, Link, Route, Switch} from 'react-router-dom';
import {Button, Card, Nav, Navbar, Toast} from 'react-bootstrap';
import RegisterPage from "./pages/RegisterPage";
import LoginPage from './pages/LoginPage';
import MyCoursesPage from './pages/MyCoursesPage';
import CreateCoursePage from './pages/CreateCoursePage';
import MainCoursePage from './pages/MainCoursePage';
import {NotificationService} from "./services/NotificationService";
import AuthService from "./services/AuthService";
const AuthContext = AuthService.AuthContext;

function App() {
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("Processing");
    const [show, setShow] = useState(false);
    const [toastStyle, setToastStyle] = useState({});

  return (
      <NotificationService.Provider value={{
          setShow: setShow,
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
          <AuthContext.Provider>
              <BrowserRouter>
                  <div>
                      <Toast show={show} onClose={()=>setShow(false)} className="fixed-bottom ml-auto mr-5 mb-5">
                          <Toast.Header style={toastStyle}>
                              <strong className="mr-auto">{title}</strong>
                              <small>time: {new Date().toLocaleTimeString("tr")}</small>
                          </Toast.Header>
                          <Toast.Body>{content}</Toast.Body>
                      </Toast>
                      <Navbar bg="light" variant="light">
                          <Navbar.Brand href="/">Ucollage</Navbar.Brand>
                          <Nav className="m-auto">
                              <Nav.Link href="/courses">Courses</Nav.Link>
                              <Nav.Link href="/my-courses">My Courses</Nav.Link>
                              <Nav.Link href="/about">About</Nav.Link>
                          </Nav>
                          <Link to="/login"><Button style={{marginRight: 20}} variant="outline-dark">Login</Button></Link>
                          <Link to="/register"><Button variant="outline-dark">Register</Button></Link>
                      </Navbar>
                      <Switch>
                          <Route exact path='/' component={Home}/>
                          <Route path='/courses' component={Api}/>
                          <Route path='/my-courses' component={MyCoursesPage}/>
                          <Route path='/course/:cid' component={MainCoursePage}/>
                          <Route path='/create-course' component={CreateCoursePage}/>
                          <Route path='/about' component={Api}/>
                          <Route path='/login' component={LoginPage}/>
                          <Route path='/register' component={RegisterPage}/>
                      </Switch>
                  </div>
              </BrowserRouter>
          </AuthContext.Provider>

      </NotificationService.Provider>
  );

}

function Home(){
    return (
        <div className="App">
            <h1>Project Home</h1>
            {/* Link to List.js */}
            <Link to={'./list'}>
                <Button>
                    Selam
                </Button>
            </Link>
        </div>
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
