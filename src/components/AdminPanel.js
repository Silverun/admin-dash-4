import { useContext, useRef, useEffect, useState, useCallback } from "react";
import { UserContext } from "../context/UserContextProvider";

const AdminPanel = () => {
  const [allUsers, setAllUsers] = useState(null);
  const [checkedUsers, setCheckedUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("logged_in_user"))
  );
  const userCtx = useContext(UserContext);

  const handleLogout = useCallback(() => {
    localStorage.clear();
    userCtx.setIsAuth(false);
  }, [userCtx]);

  const checkboxesRefs = useRef([]);

  const getAllUsers = useCallback(() => {
    fetch("https://admin-dash-4.herokuapp.com/users")
      .then((response) => response.json())
      .then((data) => {
        setAllUsers(data);
      });
  }, []);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const blockUserHandler = async () => {
    if (checkedUsers.some((userId) => +userId === currentUser.id)) {
      handleLogout();
    }
    try {
      const response = await fetch("https://admin-dash-4.herokuapp.com/block", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          checkedUsers: checkedUsers,
          activeUser: currentUser.id,
        }),
      });
      if (response.ok) {
        getAllUsers();
      } else if (response.status === 403) {
        throw new Error("This user was forbidden to take the action!");
      } else {
        throw new Error("Something went wrong!");
      }
    } catch (error) {
      alert(error);
      handleLogout();
    }
  };

  const unblockUserHandler = async () => {
    try {
      const response = await fetch(
        "https://admin-dash-4.herokuapp.com/unblock",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            checkedUsers: checkedUsers,
            activeUser: currentUser.id,
          }),
        }
      );
      if (response.ok) {
        getAllUsers();
      } else if (response.status === 403) {
        throw new Error("This user was forbidden to take the action!");
      } else {
        throw new Error("Something went wrong!");
      }
    } catch (error) {
      alert(error);
      handleLogout();
    }
  };

  const deleteUserHandler = async () => {
    if (checkedUsers.some((userId) => +userId === currentUser.id)) {
      console.log("Deleted self");
      handleLogout();
    }
    try {
      const response = await fetch(
        "https://admin-dash-4.herokuapp.com/delete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            checkedUsers: checkedUsers,
            activeUser: currentUser.id,
          }),
        }
      );
      if (response.ok) {
        getAllUsers();
      } else if (response.status === 403) {
        throw new Error("This user was forbidden to take the action!");
      } else {
        throw new Error("Something went wrong!");
      }
    } catch (error) {
      alert(error);
      handleLogout();
    }
  };

  const onCheckHandler = (e) => {
    if (e.target.checked === true) {
      setCheckedUsers((prevCheckedUsers) => {
        if (prevCheckedUsers.some((user) => user === e.target.id)) {
          return prevCheckedUsers;
        } else {
          return [...prevCheckedUsers, e.target.id];
        }
      });
    }
    if (e.target.checked === false) {
      // console.log("Unchecked ID - " + e.target.id);
      setCheckedUsers((prevCheckedUsers) => {
        const filteredCheckedUsers = prevCheckedUsers.filter(
          (id) => id !== e.target.id
        );
        return filteredCheckedUsers;
      });
    }
  };

  const onCheckAllHandler = (e) => {
    if (e.target.checked === true) {
      checkboxesRefs.current.forEach((e) => {
        e.checked = true;
        const newAllUsers = allUsers.map((user) => user.id.toString());
        setCheckedUsers(newAllUsers);
      });
    }
    if (e.target.checked === false) {
      checkboxesRefs.current.forEach((e) => {
        e.checked = false;
        setCheckedUsers([]);
      });
    }
  };

  const addToRefs = (el) => {
    if (el && !checkboxesRefs.current.includes(el)) {
      checkboxesRefs.current.push(el);
    }
  };

  const loadingSpinner = (
    <tr className="d-flex align-items-center">
      <td
        className="spinner-border ms-auto"
        role="status"
        aria-hidden="true"
      ></td>
    </tr>
  );

  return (
    <div className="container-md mt-3">
      <h3 className="mb-2">Users dashboard</h3>
      <h4 className="text-muted mb-3">Greetings, {currentUser.user_name}.</h4>
      <div
        className="btn-toolbar mb-3"
        role="toolbar"
        aria-label="Toolbar with button groups"
      >
        <div className="btn-group me-3" role="group">
          <button
            onClick={blockUserHandler}
            type="button"
            className="btn btn-secondary"
          >
            Block
          </button>
        </div>
        <div className="btn-group me-3" role="group">
          <button
            onClick={unblockUserHandler}
            type="button"
            className="btn btn-success"
          >
            Unblock
          </button>
        </div>
        <div className="btn-group me-3" role="group">
          <button
            onClick={deleteUserHandler}
            type="button"
            className="btn btn-danger"
          >
            Delete
          </button>
        </div>
        <div className="btn-group" role="group">
          <button onClick={handleLogout} type="button" className="btn btn-info">
            Log out
          </button>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">
              <input
                onChange={onCheckAllHandler}
                type="checkbox"
                id="check_all"
              />
            </th>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Last login</th>
            <th scope="col">Registered</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {allUsers === null
            ? loadingSpinner
            : allUsers.map((users) => {
                return (
                  <tr key={users.id}>
                    <td>
                      <input
                        ref={addToRefs}
                        onChange={onCheckHandler}
                        type="checkbox"
                        id={users.id.toString()}
                      />
                    </td>
                    <th scope="row">{users.id}</th>
                    <td>{users.user_name}</td>
                    <td>{users.user_email}</td>
                    <td>{users.last_login_time.slice(0, -4)}</td>
                    <td>{users.reg_time.slice(0, -4)}</td>
                    <td>{users.user_status}</td>
                  </tr>
                );
              })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
