import {Button} from "react-bootstrap";
import {Link} from 'react-router-dom';

export default function MyCoursesPage() {
    return (
        <div style={{"margin": "50px 40%"}}>
            <h1>My Courses</h1>
            <Link>
                <Link to="/create-course"><Button style={{marginRight: 20}} variant="outline-dark">Create Course</Button></Link>
            </Link>
        </div>
    )
}