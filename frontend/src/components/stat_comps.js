import React, {useState, useEffect} from 'react';
import { Bar, Pie, Line} from 'react-chartjs-2';
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
              labels: response.data.map(r=>r.title),
              datasets: [
                {
                  label: 'Best selling courses',
                  data: response.data.map(r=>r.user_count),
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

function DistributionCourses(){
    const [data, setData] = useState(null);

    useEffect(async()=>{
        let response = await axios({
            url: "/api/admin/dist-courses"
        });
        console.log(response);
        if(response.status == 200){
            setData({
              labels: response.data.map(r=>r.category),
              datasets: [
                {
                  label: 'Distribution of courses',
                  data: response.data.map(r=>r.counts),
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
    return (<Pie data={data} width={500} height={500}/>);
}

function AveragePricePerCategory(){
    const [data, setData] = useState(null);

    useEffect(async()=>{
        let response = await axios({
            url: "/api/admin/average-category"
        });
        console.log(response);
        if(response.status == 200){
            setData({
              labels: response.data.map(r=>r.category),
              datasets: [
                {
                  label: 'Average courses prices per category',
                  data: response.data.map(r=>r.avgPrice),
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
    return (<Line data={data} width={1000} height={500}/>);
}

function MostRatedCourses(){
    const [data, setData] = useState(null);

    useEffect(async()=>{
        let response = await axios({
            url: "/api/admin/most-rated"
        });
        console.log(response);
        if(response.status == 200){
            setData({
              labels: response.data.map(r=>r.title),
              datasets: [
                {
                  label: 'Best rated courses',
                  data: response.data.map(r=>r.ratingAvg),
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



export {MostBoughtCourses, MostRatedCourses,DistributionCourses, AveragePricePerCategory}
