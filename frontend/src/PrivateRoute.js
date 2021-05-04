import React, {useEffect, useState} from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthService from "./services/AuthService";
import {Container, Row} from "react-bootstrap";

const PrivateRoute = ({component: Component, role, ...rest}) => {
    const [user, setUser] = useState(null);
    useEffect(async()=>{
        let temp = await AuthService.getCurrentUser();
        if(temp){
            if(role == 0){ // USER
                setUser(temp.data);
            }else if(role == 1){ // CREATOR
                if(temp.data.isCreator){
                    setUser(temp.data);
                }
            }else if(role == 2){ // ADMIN
                if(temp.data.isAdmin){
                    setUser(temp.data);
                }
            }
        }
    }, []);
    return (
        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /signin page
        <Route {...rest} render={props => (
             true ?
                <Component {...props} />
                : <Container fluid>
                     <Row className="justify-content-md-center mt-2">
                     <h2>You cannot see this page</h2>
                     </Row>
             </Container>
        )} />
    );
};

export default PrivateRoute;