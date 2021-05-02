import './App.css';
import {useEffect, useState} from "react";
import {BrowserRouter, Link, Route, Switch} from 'react-router-dom';
import {Button, Card, Nav, Navbar} from 'react-bootstrap';
import RegisterPage from "./pages/RegisterPage";
import LoginPage from './pages/LoginPage';
import MyCoursesPage from './pages/MyCoursesPage';
import CreateCoursePage from './pages/CreateCoursePage';

function App() {

  return (
      <BrowserRouter>
          <div>
              <>
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
              </>
              <Switch>
                  <Route exact path='/' component={Home}/>
                  <Route path='/courses' component={Api}/>
                  <Route path='/my-courses' component={MyCoursesPage}/>
                  <Route path='/create-course' component={CreateCoursePage}/>
                  <Route path='/about' component={Api}/>
                  <Route path='/login' component={LoginPage}/>
                  <Route path='/register' component={RegisterPage}/>
              </Switch>
          </div>
      </BrowserRouter>
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
