import {Button, Card, Col, Container, Form, Image, Jumbotron, Row, Toast} from "react-bootstrap";
import {useState, useRef, useContext, useEffect} from "react";
import {Link, useHistory} from 'react-router-dom';
import axios from "axios";
import AuthService from "../services/AuthService";
import {NotificationContext} from "../services/NotificationContext";
import {AuthContext} from "../services/AuthContext";

export default function ProfilePage() {
    const {setShow, setContent, setIntent} = useContext(NotificationContext);
    const {getCurrentUser} = useContext(AuthContext);
    const history = useHistory();
    const [user, setUser] = useState(null);

    useEffect(async ()=>{
        let response = await getCurrentUser;
        setUser(response?.data);
    }, []);

    const logout = async () => {
        AuthService.logout();
        setShow(true);
        setIntent("success");
        setContent("Logout", "You logout successfully.");
        window.location = window.location.origin;
    }

    return (
        <Container style={{marginTop: 20}}>
            <Card>
                <Card.Header>
                    Profile of {user?.name}
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Button className="ml-auto mr-2" variant="danger" type="submit" onClick={logout}>
                            Log out
                        </Button>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    )
}
