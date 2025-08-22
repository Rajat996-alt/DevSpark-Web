import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useAsyncError, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId,
          password,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong!");
    }
  };

  const handleSignup = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        {
          firstName,
          lastName,
          emailId,
          password,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong!");
    }
  };

  return (
    <div className="flex justify-center py-14">
      <div className="card bg-blue-900 text-primary-content w-96 rounded-2xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold justify-center">
            {isLoginForm ? "Log In" : "Sign Up"}
          </h2>
          <div>
            {!isLoginForm && (
              <>
                <fieldset className="fieldset m-2">
                  <legend className="fieldset-legend text-lg">
                    First Name
                  </legend>
                  <input
                    type="text"
                    className="input"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </fieldset>
                <fieldset className="fieldset m-2">
                  <legend className="fieldset-legend text-lg">Last Name</legend>
                  <input
                    type="text"
                    className="input"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </fieldset>
              </>
            )}
            <fieldset className="fieldset m-2">
              <legend className="fieldset-legend text-lg">Email Id</legend>
              <input
                type="text"
                className="input"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
              />
            </fieldset>
            <fieldset className="fieldset m-2">
              <legend className="fieldset-legend text-lg">Password</legend>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </fieldset>
          </div>
          <p className="text-red-500 mx-3">{error}</p>
          <div className="card-actions justify-center m-2">
            <button
              className="btn"
              onClick={isLoginForm ? handleLogin : handleSignup}
            >
              {isLoginForm ? "Log In" : "Sign Up"}
            </button>
          </div>
          <p className="text-center text-gray-300 mt-4">
            {isLoginForm ? (
              <>
                New to DevSpark?{" "}
                <span
                  onClick={() => setIsLoginForm((value) => !value)}
                  className="text-white font-medium cursor-pointer hover:underline"
                >
                  Sign up now
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span
                  onClick={() => setIsLoginForm((value) => !value)}
                  className="text-white font-medium cursor-pointer hover:underline"
                >
                  Log in now
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
