import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Nav, Navbar } from "react-bootstrap";
import { getAuth, signOut, onAuthStateChanged, UserCredential } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";


function App() {
  const auth = getAuth();
  const localStorage = window.localStorage;

  var [user, setUser] = useState<UserCredential["user"]>();

  useEffect(() => {
    console.log("refresh");
    authUser();
  }, [user]);

  function authUser() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        //User is signed in
        localStorage.setItem("isLoggedIn", "true");
      } else {
        //user signed out
        localStorage.removeItem("isLoggedIn");
      }
    });
  }

  function logoutUser() {
    signOut(auth).then(() => {
      window.location.href = "/";
      toast.success("Logged Out!");
    }).catch((error) => {
      toast.error(error.message);
    });
  }

  return (
    <div className="App">
      <div>
        <Toaster />
      </div>
      <Navbar expand="sm" className="flex items-center p-3 bg-white/50">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="flex space-x-5 ml-4 items-center w-screen font-bold"
        >
          <Nav className="mr-auto flex ml-4">
            {!JSON.parse(localStorage.getItem("isLoggedIn")!) && (
              <Nav.Link className="p-0" href="/">
                Home
              </Nav.Link>
            )}
            {JSON.parse(localStorage.getItem("isLoggedIn")!) && (
              <Nav.Link className="p-0" href="/dashboard">
                Dashboard
              </Nav.Link>
            )}
          </Nav>
          <div className="flex-grow"></div>
          <Nav>
            {!JSON.parse(localStorage.getItem("isLoggedIn")!) && (
              <Nav.Link href="/signup">Sign Up</Nav.Link>
            )}
            {JSON.parse(localStorage.getItem("isLoggedIn")!) && (
              <Nav.Link className="bg-red-500 rounded-lg p-2">
                <button onClick={logoutUser}><p className="font-bold text-white">Logout</p></button>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
