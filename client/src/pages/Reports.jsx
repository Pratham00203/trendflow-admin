/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import moment from "moment";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'

export default function Reports() {
    const [reports, setReports] = useState([]);
    useEffect(() => {
        document.title = "All reports";
        getReports();
    }, [])

    const getReports = async () => {
        try {
            const res = await axios({
                method: "get",
                url: `https://trendflow-admin-backend.onrender.com/api/post/reports/all`,
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            })

            setReports(res.data.reports)
        } catch (error) {
            console.log(error)
        }
    }

    return <>
        <div className="main-content">
            <h1>All <span style={{ color: '#6b6b6b' }}>Reports</span></h1>
            <table className="reports-section" >
                <thead>
                    <th><b>Report ID</b></th>
                    <th><b>Post ID</b></th>
                    <th><b>User ID</b></th>
                    <th><b>Reason</b></th>
                    <th><b>Created at</b></th>
                    <th></th>
                </thead>
                <tbody>
                    {
                        reports.map((r, i) => {
                            return <tr key={i}>
                                <td>#{r._id}</td>
                                <td>{r.post_id}</td>
                                <td>{r.user_id}</td>
                                <td style={{ color: "rgb(189, 4, 4)" }}>{r.reason}</td>
                                <td>{moment(r.createdAt).format("MMM Do YY")}</td>
                                <td><Link to={`/report/${r._id}`}>View</Link></td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
    </>
}