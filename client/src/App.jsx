/* eslint-disable no-unused-vars */
import { Outlet, useNavigate } from "react-router-dom";
import "./App.css";
import { useEffect, useState } from "react";
import checkAuth from "./helpers/auth";
import AdminContext from "./context/AdminContext";
import axios from "axios";
import Sidebar from "./util/Sidebar";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({
    _id: "",
    username: "",
    email: ""
  });

  useEffect(() => {
    document.title = "TrendFlow.";
    if (checkAuth()) {
      getAdmin();
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      navigate("/auth/login");
    }
  }, []);

  const getAdmin = async () => {
    try {
      let res = await axios({
        method: "get",
        url: "http://localhost:8000/api/auth/",
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      setAdmin((prev) => {
        return {

          _id: res.data.admin._id,
          username: res.data.admin.username,
          email: res.data.admin.email

        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  const changeAdminSettings = (newAdminState) => {
    setAdmin(newAdminState);
  };

  return (
    <AdminContext.Provider value={{ admin, changeAdminSettings }}>
      <div className='container d-flex'>
        {admin && <Sidebar />}
        <Outlet />
      </div>
    </AdminContext.Provider>
  );
}
