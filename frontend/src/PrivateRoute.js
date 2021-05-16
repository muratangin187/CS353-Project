import React, {useEffect, useState} from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthService from "./services/AuthService";
import {Container, Row} from "react-bootstrap";

const PrivateRoute = ({component: Component, role, ...rest}) => {
    const [perm, setPerm] = useState(false);
    useEffect(async()=>{
        checkPerm();
    }, []);

    const checkPerm = async()=>{
        let temp = await AuthService.getCurrentUser();
        if(role.includes(0) && role.includes(1) && role.includes(2)){// USER, ADMIN AND CREATOR 
            if(temp){
                setPerm(true);
            }else{
                setPerm(false);
            }
        }else if(role.includes(0) && role.includes(2)){// USER AND ADMIN
            if(temp && !temp.data.isCreator){
                setPerm(true);
            }else{
                setPerm(false);
            }
        }else if(role.includes(0) && role.includes(1)){// USER AND CREATOR 
            if(temp && !temp.data.isAdmin){
                setPerm(true);
            }else{
                setPerm(false);
            }
        }else if(role.includes(0)){
            if(temp && !temp.data.isAdmin && !temp.data.isCreator){
                setPerm(true);
            }else{
                setPerm(false);
            }
        }else if(role.includes(1)){
            if(temp && temp.data.isCreator){
                setPerm(true);
            }else{
                setPerm(false);
            }
        }else if(role.includes(2)){
            if(temp && temp.data.isAdmin){
                setPerm(true);
            }else{
                setPerm(false);
            }
        }else if(role.includes(3)){
            if(!temp){
                setPerm(true);
            }else{
                setPerm(false);
            }
        }else{
            setPerm(false);
        }
    }
    checkPerm();
    return (
        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /signin page
        <Route {...rest} render={props => (
             perm ?
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
