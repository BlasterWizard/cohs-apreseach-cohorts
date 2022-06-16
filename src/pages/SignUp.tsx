import React, { useState, useEffect } from "react";
import db from "../firebase";
import { doc, getDoc, setDoc, collection } from "firebase/firestore";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import Select from "react-select";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";
import { SelectOption } from "../Interfaces+Classes";
import { getAvailableGraduatingYears } from "../HelperFunctions";


const SignUp = () => {
  const [SUEmailAddress, setSUEmailAddress] = useState<string>("");
  const [SUPassword, setSUPassword] = useState<string>("");
  const [SUConfirmPassword, setSUConfirmPassword] = useState<string>("");
  const [SUFirstName, setSUFirstName] = useState<string>("");
  const [SULastName, setSULastName] = useState<string>("");
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<SelectOption>();

  useEffect(() => {
    fetchAvailableGraduatingYears();
  }, []);

  const signUpUser = () => {
    if (!checkIfFieldsAreEmpty()) {
      if (doPasswordsMatch()) {
        createUserInFirestore();
      }
    }
  };

  async function fetchAvailableGraduatingYears() {
    let options = await getAvailableGraduatingYears();
    setOptions(options);
  }

  async function createUserInFirestore() {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, SUEmailAddress, SUPassword)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        const newUserRef = doc(collection(db, "users"));
        await setDoc(newUserRef, {
          firstName: SUFirstName.trim(),
          lastName: SULastName.trim(),
          studentUID: user.uid,
          studentDocID: newUserRef.id,
          graduatingYear: selectedOption?.value,
          isAdmin: false
        });
        toast.success("Sign Up Successful! Redirecting...");
        window.location.href = "/discover";
        console.log("user logged in");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage);
      });
  }

  function checkIfFieldsAreEmpty(): boolean {
    if (
      SUEmailAddress == "" ||
      SUPassword == "" ||
      SUConfirmPassword == "" ||
      SUFirstName == "" ||
      SULastName == "" ||
      options == []
    ) {
      toast.error(
        "A field can not be empty. Please check if you have missed a field."
      );
      return true;
    }
    return false;
  }

  function doPasswordsMatch(): boolean {
    if (SUPassword.trim() == SUConfirmPassword.trim()) {
      return true;
    }
    //passwords don't match
    toast.error("Passwords Must Match. Please try again.");
    return false;
  }
  
  const SUEmailAddressHandler = (e: any) => {
    setSUEmailAddress(e.target.value);
  };

  const SUPasswordHandler = (e: any) => {
    setSUPassword(e.target.value);
  };

  const SUConfirmPasswordHandler = (e: any) => {
    setSUConfirmPassword(e.target.value);
  };

  const SUFirstNameHandler = (e: any) => {
    setSUFirstName(e.target.value);
  };

  const SULastNameHandler = (e: any) => {
    setSULastName(e.target.value);
  };

  const selectGraduatingYearHandler = (selectedOption: any) => {
    setSelectedOption(selectedOption);
  }

  return (
    <>
      <main>
        {/* Sign In Hero */}
        <div className="bg-white opacity-75 p-3 rounded-lg flex flex-col max-w-lg space-y-5">
          <h2 className="text-center text-2xl font-bold">Sign Up</h2>
          {/* First & Last Name */}
          <div className="grid grid-cols-2 justify-items-center">
            <div className="flex flex-col">
              <Form.Label className="font-bold">First Name:</Form.Label>
              <Form.Control
                value={SUFirstName}
                onChange={SUFirstNameHandler}
                type="text"
                id="firstname"
                className="bg-white opacity-75 border-2 border-solid border-black rounded-md p-1"
              />
            </div>

            <div className="flex flex-col">
              <Form.Label className="font-bold">Last Name:</Form.Label>
              <Form.Control
                value={SULastName}
                onChange={SULastNameHandler}
                type="text"
                id="firstname"
                className="bg-white opacity-75 border-2 border-solid border-black rounded-md p-1"
              />
            </div>
          </div>

          <div className="flex flex-col">
            {/* Email */}
            <Form.Label className="font-bold">Email:</Form.Label>
            <Form.Control
              value={SUEmailAddress}
              onChange={SUEmailAddressHandler}
              type="text"
              id="username"
              aria-describedby="userNameHelpBlock"
              className="bg-white opacity-75 border-2 border-solid border-black rounded-md p-1"
            />
            <Form.Text id="userNameHelpBlock" muted>
              Please use a <span className="font-bold">NON</span> School
              District issued email.
            </Form.Text>
          </div>

          {/* First Password */}
          <div className="flex flex-col">
            <Form.Label className="font-bold">Password:</Form.Label>
            <Form.Control
              value={SUPassword}
              onChange={SUPasswordHandler}
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

          {/* Second Password To Confirm*/}
          <div className="flex flex-col">
            <Form.Label className="font-bold">Confirm Password:</Form.Label>
            <Form.Control
              value={SUConfirmPassword}
              onChange={SUConfirmPasswordHandler}
              type="password"
              id="inputPassword5"
              aria-describedby="passwordHelpBlock"
              className="bg-white opacity-75 border-2 border-solid border-black rounded-md p-1"
            />
            <Form.Text id="passwordHelpBlock" muted>
              Retype Password from previous field
            </Form.Text>
          </div>

          {/* Year of Graduation */}
          <div>
            <Form.Label className="font-bold">Graduating Year:</Form.Label>
            <Select
              onChange={selectGraduatingYearHandler}
              options={options}
              placeholder={"Select your Graduating Class Year"}
            />
          </div>

          <Form.Group className="flex justify-center m-4">
            <Button
              onClick={signUpUser}
              className="bg-green-400 hover:bg-green-500 font-bold text-white p-2 rounded-lg"
              variant="primary"
            >
              Sign Up
            </Button>
          </Form.Group>
        </div>
      </main>
    </>
  );
};

export default SignUp;
