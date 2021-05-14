import {Button, Col, Container, Form, Image, ListGroup, Modal, Row} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {NotificationContext} from "../services/NotificationContext";
import {AuthContext} from "../services/AuthContext";
import {useHistory} from "react-router-dom";
import axios from "axios";

export default function MyBalance(){
    const {setShow, setContent, setIntent} = useContext(NotificationContext);
    const {getCurrentUser} = useContext(AuthContext);
    const history = useHistory();
    const [user, setUser] = useState(null);
    const [newBalance, setNewBalance] = useState(10);
    const [updatePage, setUpdatePage] = useState(false);


    useEffect(async()=>{
        let response = await getCurrentUser;
        setUser(response?.data);
    }, [updatePage]);

    const loadBalance = async () => {
        if(newBalance<=0){
            setShow(true);
            setContent("Error", "Please enter a valid value for loaded balance");
            setIntent("failure");
            return;
        }
        let response2 = await axios({
            url: "/api/user/load-balance/",
            method: "POST",
            data: {
                userId: user.id,
                balance: newBalance
            }
        });
        setShow(true);
        if(response2.status == 400){
            setContent("Error", response2.data.message);
            setIntent("failure");
        }else{
            setContent("Success", response2.data.message);
            setIntent("success");
        }
        setUpdatePage(!updatePage);
        setNewBalance(0);
    }

    return (
        <Container fluid>
            <Row className="justify-content-md-center mt-5 align-items-center">
                    <h1 className="mr-5">
                        Murat ANGIN
                    </h1>
                    <Image
                        className="ml-5"
                        roundedCircle
                        width="200"
                        height="200"
                        src="https://www.donanimhaber.com/cache-v2/?t=20210507225737&width=-1&text=0&path=https://www.donanimhaber.com/images/images/haber/133189/340x191motosiklet-oyunu-bike-baron-2-ios-icin-on-siparise-acildi.jpg"
                    />
            </Row>
            <Row className="justify-content-md-center mt-5 align-items-center">
                <h2>Balance: {user?.balance}</h2>
            </Row>
            <Row className="justify-content-md-center ml-5 align-items-center">
                <Col className="justify-content-md-center ml-5 mt-5 align-items-center">
                    <Form.Control type="number" placeholder="Balance will be added" value={newBalance} onChange={(e)=>setNewBalance(e.target.value)} required/>
                </Col>
                <Col className="justify-content-md-center mt-5 align-items-center">
                    <Button className="ml-5" variant="success" type="submit" onClick={()=>loadBalance()}>
                        Load Balance
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}