import React, {useState, useEffect} from 'react';
import { Bar } from 'react-chartjs-2';
import axios from "axios";

const lightColors = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ];

const darkColors = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ]


function MostBoughtCourses(){
    const [data, setData] = useState(null);

    useEffect(async()=>{
        let response = await axios({
            url: "/api/admin/most-bought"
        });
        console.log(response);
        if(response.status == 200){
            setData({
              labels: [...response.data.map(r=>r.title),"a","b","c","d","e"],
              datasets: [
                {
                  label: 'Best selling courses',
                  data: [...response.data.map(r=>r.user_count), 1,2,3,4,5],
                  backgroundColor: lightColors.slice(0, 6),
                  borderColor: darkColors.slice(0, 6),
                  borderWidth: 1,
                },
              ],
            });
        }
    }, []);
    if(!data)
        return (<>Error</>);
    return (<Bar data={data} width={1000} height={500}/>);
}


export {MostBoughtCourses}
