/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react"
import AdminContext from '../context/AdminContext'
import axios from 'axios'
import moment from "moment";
import toast from "react-hot-toast";

export default function Admins() {
    const { admin } = useContext(AdminContext);
    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        document.title = "All admins";
        getAdmins();
    }, [])

    const deleteAccount = async (adminid) => {
        if (window.confirm("Are you sure you want to delete this account?")) {
            try {
                const res = await axios({
                    method: "delete",
                    url: `https://trendflow-admin-backend.onrender.com/api/admin/delete/${adminid}`,
                    headers: {
                        'x-auth-token': localStorage.getItem("token")
                    }
                })

                if (res.status === 200) {
                    setAdmins(prev => prev.filter(a => a._id !== adminid))
                    toast.success(res.data.msg);
                }

            } catch (error) {
                toast.error(error.response.data.error);
            }
        }
    }

    const getAdmins = async () => {
        try {
            const res = await axios({
                method: 'get',
                url: "https://trendflow-admin-backend.onrender.com/api/admin/all",
                headers: {
                    'x-auth-token': localStorage.getItem("token")
                }
            })

            setAdmins(res.data.admins)
        } catch (error) {
            console.log(error)
        }
    }

    return <>
        <div className="main-content">
            <h1>All <span style={{ color: "#6b6b6b" }}>admins.</span></h1>
            <div className="admins-section d-flex flex-col" style={{ gap: "20px" }}>
                {
                    admins.map((a, i) => {
                        return <div className="admin d-flex align-center" key={i}>
                            <div className="admin-details">
                                <p><b>Admin ID: </b>{a._id}</p>
                                <p><b>Admin Username: </b>{a.username}</p>
                                <p><b>Admin Email: </b>{a.email}</p>
                                <p><b>Account created on: </b>{moment(a.createdAt).format("MMMM DD YYYY")}</p>
                            </div>
                            {
                                admin._id !== a._id && <button className="delete-btn" onClick={() => deleteAccount(a._id)}>Delete account</button>
                            }
                        </div>
                    })
                }
            </div>
        </div>
    </>
}