import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Nav, Navbar } from "react-bootstrap";
import { getAuth, signOut, onAuthStateChanged, UserCredential } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import { User, userConverter } from "./Interfaces+Classes";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import db from "./firebase";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PendingUserPage from "./pages/PendingUserPage";
import PageNotFound from "./pages/Special Pages/PageNotFound";


function App() {
  const auth = getAuth();
  const localStorage = window.localStorage;

  var [user, setUser] = useState<UserCredential["user"]>();
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User>();

  const allUsersQuery = query(collection(db, "users").withConverter(userConverter));

  useEffect(() => {
    console.log("refresh");
    authUser();
  }, [user]);

  function authUser() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchAndListenToAllUsers(user);
        //User is signed in
        localStorage.setItem("isLoggedIn", "true");
        setUser(user);
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

  function fetchAndListenToAllUsers(user: UserCredential["user"]) {
    const unsubscribeToAllUsers = onSnapshot(allUsersQuery, (querySnapshot) => {
      const users: User[] = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().studentUID === user?.uid) {
          console.log("got current user");
          //get current user
          setCurrentUser(doc.data());
          if (doc.data().isAdmin) {
            localStorage.setItem("isAdmin", "true");
          } else {
            localStorage.setItem("isAdmin", "false");
          }

          //set appropriate isApproved
          if (doc.data().approvalStatus.isApproved) {
            localStorage.setItem("isApproved", "true");
          } else {
            localStorage.setItem("isApproved", "false");
          }
        }
        users.push(doc.data());
      });
      setUsers(users);
    });
    console.log(currentUser);
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
          <Nav className="mr-auto flex ml-4 space-x-5">
            {!JSON.parse(localStorage.getItem("isLoggedIn")!) && (
              <Nav.Link className="p-0" href="/">
                Home
              </Nav.Link>
            )}
             {JSON.parse(localStorage.getItem("isLoggedIn")!) && JSON.parse(localStorage.getItem("isAdmin")!) && (
              <Nav.Link className="p-0" href="/adminDashboard">
                Dashboard
              </Nav.Link>
            )}
            {JSON.parse(localStorage.getItem("isLoggedIn")!) && JSON.parse(localStorage.getItem("isApproved")!) &&(
              <Nav.Link className="p-0" href="/discover">
                Discover
              </Nav.Link>
            )}
            {JSON.parse(localStorage.getItem("isLoggedIn")!) && JSON.parse(localStorage.getItem("isApproved")!) && (
              <Nav.Link className="p-0" href="/profile">
                Profile
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
        <Route path="*" element={<PageNotFound />} />
        <Route path="/" element={<Home currentUser={currentUser}/>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/pendingUserPage" element={<PendingUserPage user={user}/>} />
        <Route path="/adminDashboard" element={<AdminDashboard users={users}/>} />
        <Route path="/discover" element={<Discover users={users}/>} />
        <Route path="/profile" element={<Profile user={user} currentUser={currentUser}/>} />
      </Routes>
    </div>
  );
}

export default App;
