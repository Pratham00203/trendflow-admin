/* eslint-disable no-unused-vars */
import React from 'react'
import ReactDOM from 'react-dom/client'
import Auth from "./Auth.jsx";
import App from "./App.jsx";
import { Public } from "./util/Public.jsx";
import { Private } from "./util/Private.jsx";
import Login from "./pages/Login.jsx";
import { Toaster } from "react-hot-toast";
import NotFound from "./util/NotFound.jsx";
import Dashboard from './pages/Dashboard.jsx'
import AdminForm from './pages/AdminForm.jsx';
import Admins from './pages/Admins.jsx';
import Report from './pages/Report.jsx';
import Reports from './pages/Reports.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router basename={"/"}>
      <Routes>
        <Route path='*' element={<NotFound />} />
        <Route path='/auth' element={<Auth />}>
          <Route
            path='login'
            element={
              <Public>
                <Login />
              </Public>
            }
          />
        </Route>
        <Route path='/' element={<App />}>
          <Route
            path=''
            element={
              <Private>
                <Dashboard />
              </Private>
            }
          />
          <Route
            path='dashboard'
            element={
              <Private>
                <Dashboard />
              </Private>
            }
          />
          <Route
            path='/admin/create'
            element={
              <Private>
                <AdminForm option="Create" />
              </Private>
            }
          />
          <Route
            path='/update/me'
            element={
              <Private>
                <AdminForm option="Update" />
              </Private>
            }
          />
          <Route
            path='/admins/all'
            element={
              <Private>
                <Admins />
              </Private>
            }
          />
          <Route
            path='/reports'
            element={
              <Private>
                <Reports />
              </Private>
            }
          />
          <Route
            path='/report/:reportid'
            element={
              <Private>
                <Report />
              </Private>
            }
          />
        </Route>
      </Routes>
    </Router>
    <Toaster
      position='top right'
      toastOptions={{
        duration: 3000,
        style: {
          background: "#000",
          color: "#fff",
          fontSize: "1.6rem",
        },
      }}
    />
  </React.StrictMode>
)
