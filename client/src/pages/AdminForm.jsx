/* eslint-disable no-unused-vars */
/* eslint-disable no-empty */
import { useRef } from "react";
import { useState } from "react"
import EyeImg from "../assets/images/eye.png";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import AdminContext from '../context/AdminContext'
import axios from "axios";



/* eslint-disable react/prop-types */
export default function AdminForm({ option }) {
    const { admin, changeAdminSettings } = useContext(AdminContext);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()
    const username = useRef();
    const email = useRef();
    const password = useRef();


    useEffect(() => {
        document.title = `${option} admin.`
        if (option === "Update") {
            email.current.value = admin.email;
            username.current.value = admin.username;
        }

    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        let flag = 0;
        if (
            username.current.value.trim() === "" ||
            email.current.value.trim() === ""
        ) {
            flag = 1;
            toast.error("All fields are required");
        }

        if (!email.current.value.match(/[a-zA-Z]+\d*[@][a-z]+[.].../)) {
            flag = 1;
            toast.error("Enter a valid email id");
        }

        if (flag === 0) {
            option === "Create" ? createAdmin() : updateAdmin();
        }
    };

    const handleClick = async () => {
        if (window.confirm("Are you sure you want to delete your account?")) {
            try {
                const res = await axios({
                    method: "delete",
                    url: `https://trendflow-admin-backend.onrender.com/api/admin/delete/${admin._id}`,
                    headers: {
                        'x-auth-token': localStorage.getItem("token")
                    }
                })

                toast.success(res.data.msg);
                navigate('/auth/login');
            } catch (error) {
                toast.error(error.response.data.error);
            }
        }
    }


    const createAdmin = async () => {
        try {
            const res = await axios({
                method: 'post',
                url: "https://trendflow-admin-backend.onrender.com/api/auth/register",
                data: {
                    email: email.current.value,
                    password: password.current.value,
                    username: username.current.value
                }
            })

            toast.success("Account created");
            navigate('/admins/all')
        } catch (error) {
            toast.error(error.response.data.error);

        }
    }

    const updateAdmin = async () => {
        try {
            const res = await axios({
                method: 'put',
                url: "https://trendflow-admin-backend.onrender.com/api/admin/update/me",
                data: {
                    email: email.current.value,
                    username: username.current.value
                },
                headers: {
                    'x-auth-token': localStorage.getItem("token")
                }
            })

            toast.success(res.data.msg);
            changeAdminSettings(
                {
                    ...admin,
                    email: email.current.value,
                    username: username.current.value
                }
            )
            navigate('/admins/all')
        } catch (error) {
            toast.error(error.response.data.error);

        }
    }

    return <>
        <div className="main-content">
            <h1>{option} admin.</h1>
            <form
                className='d-flex flex-col'
                style={{ gap: "20px" }}
                onSubmit={handleSubmit}>
                <div className='form-field d-flex flex-col' style={{ gap: "5px" }}>
                    <label htmlFor='username'>Username</label>
                    <input type='text' name='username' ref={username} />
                </div>
                <div className='form-field d-flex flex-col' style={{ gap: "5px" }}>
                    <label htmlFor='email'>Email</label>
                    <input type='email' name='email' ref={email} />
                </div>
                {
                    option !== "Update" && <div className='form-field d-flex flex-col' style={{ gap: "5px" }}>
                        <label htmlFor='password'>Password</label>
                        <div className='password-field'>
                            <img
                                src={EyeImg}
                                onClick={() => setShowPassword(!showPassword)}
                            />
                            <input
                                type={showPassword ? "text" : "password"}
                                name='password'
                                ref={password}
                            />

                        </div>
                    </div>
                }
                <div className="form-btns d-flex align-center" style={{ width: '50%', gap: "30px" }}>
                    {
                        option === "Update" && <button onClick={handleClick} className="delete-btn" style={{ color: "rgb(189, 4, 4)" }} type="button">
                            Delete my account
                        </button>
                    }
                    <input style={{ margin: 0 }} type='submit' value={option} />
                </div>
            </form>

        </div>
    </>
}