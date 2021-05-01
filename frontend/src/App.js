import logo from './logo.svg';
import './App.css';
import {useEffect, useState, Component} from "react";
import {BrowserRouter, Link, Route, Switch} from 'react-router-dom';


function App() {

  return (
      <BrowserRouter>
          <div>
              <Switch>
                  <Route exact path='/' component={Home}/>
                  <Route path='/list' component={Api}/>
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
                <button variant="raised">
                    My List
                </button>
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
