import { useContext, useEffect, useRef, useState } from "react";
import React from "react";
import { UserContext } from "../context/UserContextProvider";

export const AuthForm = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const nameRef = useRef(null);
  const userCtx = useContext(UserContext);

  const [loginMessage, setLoginMessage] = useState("");

  useEffect(() => {
    if (localStorage.getItem("logged_in_user")) {
      userCtx?.setIsAuth(true);
    } else {
      userCtx?.setIsAuth(false);
    }
  }, [userCtx]);

  function resetAuthInput() {
    if (emailRef.current && passwordRef.current && nameRef.current) {
      emailRef.current.value = "";
      passwordRef.current.value = "";
      nameRef.current.value = "";
    }
  }

  function handleAuth(e) {
    e.preventDefault();
    const buttonId = e.nativeEvent.submitter?.id;
    if (
      emailRef.current?.value !== "" &&
      passwordRef.current?.value !== "" &&
      nameRef.current?.value !== ""
    ) {
      const userData = {
        name: nameRef.current?.value,
        email: emailRef.current?.value,
        password: passwordRef.current?.value,
      };
      if (buttonId === "login") {
        fetch("https://admin-dash-4.herokuapp.com/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.message) {
              setLoginMessage(data.message);
            } else {
              localStorage.setItem("logged_in_user", JSON.stringify(data));
              userCtx.setCurrentUser(data);
              userCtx?.setIsAuth(true);
            }
          });
      } else if (buttonId === "register") {
        fetch("https://admin-dash-4.herokuapp.com/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else if (response.status === 409) {
              const err = "User with this email already exists";
              setLoginMessage(err);
              throw new Error(err);
            } else {
              const err = "Something when wrong!";
              setLoginMessage(err);
              throw new Error(err);
            }
          })
          .then((data) => {
            localStorage.setItem("logged_in_user", JSON.stringify(data));
            userCtx.setIsAuth(true);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else {
      setLoginMessage("Please fill in all the fields.");
    }
    resetAuthInput();
  }

  return (
    <div
      className="container d-flex align-items-center"
      style={{ height: "100vh", width: "30vw" }}
    >
      <form
        onSubmit={handleAuth}
        className="container-xs row text-center mx-auto "
      >
        <div className="row mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            ref={nameRef}
            type="text"
            className="form-control"
            id="name"
          ></input>
        </div>
        <div className="row mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            ref={emailRef}
            type="email"
            className="form-control"
            id="email"
          ></input>
        </div>
        <div className="row mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            ref={passwordRef}
            type="password"
            className="form-control"
            id="password"
          ></input>
        </div>
        <div className="row mb-3">
          <button type="submit" id="login" className="btn btn-primary col m-3">
            Login
          </button>
          <button
            type="submit"
            id="register"
            className="btn btn-secondary col m-3"
          >
            Register
          </button>
        </div>
        {loginMessage ? (
          <div className="alert alert-success mx-auto" role="alert">
            {loginMessage}
          </div>
        ) : null}
      </form>
    </div>
  );
};
