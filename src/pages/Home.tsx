import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import toast from "react-hot-toast";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { User } from "../Interfaces+Classes";

interface HomeProps {
  currentUser: User | undefined;
}

const Home: React.FC<HomeProps> = ({ currentUser }) => {
  const [SIEmailAddress, setSIEmailAddress] = useState<string>("");
  const [SIPassword, setSIPassword] = useState<string>("");

  useEffect(() => {
    if (currentUser != undefined) {
      if (currentUser?.approvalStatus?.isApproved) {
        toast.success("Logged In! Welcome!");
        window.location.href = "/discover";

      } else {
        window.location.href = "/pendingUserPage";
      }
    }
  }, [currentUser]);

  async function signInUser() {
    if (!areSignInFieldsEmpty()) {
      const auth = getAuth();
    signInWithEmailAndPassword(auth, SIEmailAddress, SIPassword)
      .then((userCredential) => {

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage);
      });
    }
  }

  function areSignInFieldsEmpty(): boolean {
    if (SIEmailAddress == "" || SIPassword == "") {
      toast.error("A field can not be empty. Please check if you have missed a field.");
      return true;
    } 
    return false;
  }

  const SIEmailAddressHandler = (e: any) => {
    setSIEmailAddress(e.target.value);
  };

  const SIPasswordHandler = (e: any) => {
    setSIPassword(e.target.value);
  };

  return (
    <>
      <main>
        <h1 className="text-4xl text-center font-bold p-5">
          COHS AP Capstone Connect
        </h1>

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
              Your password must be 8-20 characters long, contain letters and
              numbers, and must not contain spaces, special characters, or
              emoji.
            </Form.Text>
          </div>

          <Form.Group className="flex justify-center m-4">
            <Button
              onClick={signInUser}
              className="bg-green-400 hover:bg-green-500 font-bold text-white p-2 rounded-lg"
              variant="primary"
            >
              Sign In
            </Button>
          </Form.Group>
        </div>
      </main>
    </>
  );
};

export default Home;
