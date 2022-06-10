import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import './App.css';
import Form from 'react-bootstrap/Form';


function App() {
  return (
    <div className="App">
      <nav className="bg-white opacity-50 h-10 space-x-10 p-2 font-bold">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
      </Routes>
    </div>
  );
}

const Home = () => {
  const [SIEmailAddress, setSIEmailAddress] = useState<string>("");
  const [SIPassword, setSIPassword] = useState<string>("");
    
  const SIEmailAddressHandler = (e: any) => {
    setSIEmailAddress(e.target.value);
  };
  
  const SIPasswordHandler = (e: any) => {
    setSIPassword(e.target.value);
  };
    
  return (
    <>
      <main>
        <h1 className="text-4xl text-center font-bold p-5">COHS AP Research Connect</h1>
        
        {/* Sign In Hero */}
        <div className="bg-white opacity-75 p-3 rounded-lg flex flex-col max-w-lg space-y-5">
          <h2 className="text-center text-2xl font-bold">Sign In</h2>
          <div className="flex flex-col">
            <Form.Label className="font-bold">Email:</Form.Label>
            <Form.Control
              value={SIEmailAddress}
              onChange={SIEmailAddressHandler}
              type="text"
              id="username"
              aria-describedby="userNameHelpBlock"
              className="bg-white opacity-75 border-2 border-solid border-black rounded-md p-1"
            />
            <Form.Text id="userNameHelpBlock" muted>
              Must be a valid, registered email.
            </Form.Text>
          </div>
         
          <div className="flex flex-col">
            <Form.Label className="font-bold">Password:</Form.Label>
            <Form.Control
              value={SIPassword}
              onChange={SIPasswordHandler}
              type="password"
              id="inputPassword5"
              aria-describedby="passwordHelpBlock"
              className="bg-white opacity-75 border-2 border-solid border-black rounded-md p-1"
            />
            <Form.Text id="passwordHelpBlock" muted>
              Your password must be 8-20 characters long, contain letters and numbers,
              and must not contain spaces, special characters, or emoji.
            </Form.Text>
          </div>
        </div>
      </main>
    </>
  );
}


const About = () => {
  return (
    <>
      <main>
        <h2>Who are we?</h2>
        <p>
          That feels like an existential question, don't you
          think?
        </p>
      </main>
    </>
  );
}

export default App;
