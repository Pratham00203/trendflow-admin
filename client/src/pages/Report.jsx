import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios'
import moment from "moment";
import toast from "react-hot-toast";

export default function Report() {
    const { reportid } = useParams();
    const [reportDetails, setReportDetails] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        document.title = `Report #${reportid}`;
        getReportDetails();
    }, [])

    const getReportDetails = async () => {
        try {
            const res = await axios({
                method: 'get',
                url: `https://trendflow-admin-backend.onrender.com/api/post/get/${reportid}`,
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            })
            setReportDetails(res.data.reportDetails)
        } catch (error) {
            console.log(error)
        }
    }

    const deletePost = async (postid) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                const res = await axios({
                    method: "delete",
                    url: `https://trendflow-admin-backend.onrender.com/api/post/delete/${reportid}/${postid}`,
                    headers: {
                        'x-auth-token': localStorage.getItem("token")
                    }
                })

                if (res.status === 200) {
                    toast.success(res.data.msg);
                    navigate('/reports')
                }
            } catch (error) {
                toast.error(error.response.data.error)
            }
        }
    }

    const deleteReport = async () => {
        if (window.confirm("Are you sure you want to delete this report?")) {
            try {
                const res = await axios({
                    method: "delete",
                    url: `https://trendflow-admin-backend.onrender.com/api/post/report/${reportid}/delete`,
                    headers: {
                        'x-auth-token': localStorage.getItem("token")
                    }
                })

                if (res.status === 200) {
                    toast.success(res.data.msg);
                    navigate('/reports')
                }
            } catch (error) {
                toast.error(error.response.data.error)
            }
        }
    }
    return <>
        {
            reportDetails && <div className="main-content">
                <h1>Report <span style={{ color: "#6b6b6b" }}>#{reportid}</span></h1>
                <div className="report-details">
                    <div className="report-det" style={{ borderBottom: "1px solid #6b6b6b" }}>
                        <h2>Report details : </h2>
                        <p><b>Post ID: </b>{reportDetails.post_id}</p>
                        <p><b>User ID (Reporter): </b>{reportDetails.user_id}</p>
                        <p><b>Reason: </b>{reportDetails.reason}</p>
                        <p><b>Created at: </b>{moment(reportDetails.createdAt).format("MMMM DD YYYY")}</p>
                    </div>
                    <div className="post-det" style={{ borderBottom: "1px solid #6b6b6b" }}>
                        <h2>Post details : </h2>
                        <p><b>Category: </b>{reportDetails.post.category.join(", ")}</p>
                        <p><b>Created at: </b>{moment(reportDetails.post.createdAt).format("MMMM DD YYYY")}</p>
                        <p><b>Upvotes: </b>{reportDetails.post.upvotes}</p>
                        <p><b>Downvotes: </b>{reportDetails.post.downvotes}</p>
                        <p><b>Content:</b></p>
                        <div className="post-content" dangerouslySetInnerHTML={{ __html: reportDetails.post.content }}></div>
                        <h2>User details (Publisher): </h2>
                        <p><b>User ID: </b>{reportDetails.postUser._id}</p>
                        <p><b>Username: </b>{reportDetails.postUser.username}</p>
                        <p><b>Email: </b>{reportDetails.postUser.email}</p>
                        <p><b>Bio: </b>{reportDetails.postUser.bio}</p>
                        <p><b>Joined on: </b>{moment(reportDetails.postUser.createdAt).format("MMMM DD YYYY")}</p>
                    </div>
                    <div className="user-det">
                        <h2>User details (Reporter) : </h2>
                        <p><b>Username: </b>{reportDetails.reportingUser.username}</p>
                        <p><b>Email: </b>{reportDetails.reportingUser.email}</p>
                        <p><b>Bio: </b>{reportDetails.reportingUser.bio}</p>
                        <p><b>Joined on: </b>{moment(reportDetails.reportingUser.createdAt).format("MMMM DD YYYY")}</p>
                    </div>
                    <div className="report-btns d-flex align-center" style={{ gap: "15px" }}>
                        <button className="delete-btn" onClick={() => deletePost(reportDetails.post_id)}>Delete post and report</button>
                        <button className="delete-btn" onClick={deleteReport}>Delete report</button>
                    </div>
                </div>
            </div>
        }
    </>
}