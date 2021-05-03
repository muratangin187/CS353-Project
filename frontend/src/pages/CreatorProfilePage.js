import {useEffect, useState} from "react";
import axios from "axios";

export default function CreatorProfilePage(){
    const [courseCreator, setCourseCreator] = useState({}); // course creator JSON object

    useEffect(() => {
        // /api/course/creator/:creatorId
        // TODO take creator id from props
        axios.get('/api/course/creator' + '/1')
            .then(response => {
                setCourseCreator(response.data.splice(0, 2));
                console.log("CreatorProfilePage.js\n");
                console.log(response.data.splice(0, 2)); // TODO delete console log
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    return (
        <div>
            DEBUG
        </div>
    );
}