import axios from "axios";
import { useState } from "react";
import { useEffect } from "react"

export default function Dashboard() {
    const [dashboardDetails, setDashboardDetails] = useState({
        totalUsers: 0,
        totalPosts: 0,
        totalComments: 0,
        totalReports: 0
    })

    useEffect(() => {
        document.title = "Dashboard";
        getDashboardDetails();
    }, [])

    const getDashboardDetails = async () => {
        try {
            const res = await axios({
                method: 'get',
                url: "https://trendflow-admin-backend.onrender.com/dashboard",
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            })

            setDashboardDetails(res.data)
        } catch (error) {
            console.log(error);
        }
    }

    return <>
        <div className="main-content">
            <h1>Dashboard <span style={{ color: "#6b6b6b" }}>statistics</span></h1>
            <div className="dashboard d-flex">
                <div>
                    <h1>Total Users : </h1>
                    <h3>{dashboardDetails.totalUsers}</h3>
                </div>
                <div>
                    <h1>Total Posts : </h1>
                    <h3>{dashboardDetails.totalPosts}</h3>
                </div>
                <div>
                    <h1>Total Comments : </h1>
                    <h3>{dashboardDetails.totalComments}</h3>
                </div>
                <div>
                    <h1>Total Reports : </h1>
                    <h3 style={{ color: "rgb(189, 4, 4)" }}>{dashboardDetails.totalReports}</h3>
                </div>
            </div>
        </div>
    </>
}