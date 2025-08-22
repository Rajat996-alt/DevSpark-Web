import { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [error, setError] = useState();
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);

  const saveProfile = async () => {
    //Clear the errors
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoUrl,
          age,
          gender,
          about,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      setError(err.response);
    }
  };

  return (
    <>
      <div className="flex justify-center py-14">
        <div className="flex justify-center mx-14 mb-14">
          <div className="card bg-blue-900 text-primary-content w-96 rounded-2xl">
            <div className="card-body">
              <h2 className="card-title text-2xl font-bold justify-center">
                Edit Profile
              </h2>
              <div>
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
                <fieldset className="fieldset m-2">
                  <legend className="fieldset-legend text-lg">Photo URL</legend>
                  <input
                    type="text"
                    className="input"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                  />
                </fieldset>
                <fieldset className="fieldset m-2">
                  <legend className="fieldset-legend text-lg">Age</legend>
                  <input
                    type="number"
                    className="input"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </fieldset>
                <fieldset className="fieldset m-2">
                  <legend className="fieldset-legend text-lg">Gender</legend>
                  <select
                    className="input"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="none">Select Gender</option>
                    <option value="male">male</option>
                    <option value="female">female</option>
                    <option value="others">others</option>
                  </select>
                </fieldset>

                <fieldset className="fieldset m-2">
                  <legend className="fieldset-legend text-lg">About</legend>
                  <textarea
                    type="text"
                    className="textarea"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                  ></textarea>
                </fieldset>
              </div>
              <p className="text-red-500 mx-3">{error}</p>
              <div className="card-actions justify-center m-2">
                <button className="btn" onClick={saveProfile}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
        <UserCard
          user={{ firstName, lastName, photoUrl, age, gender, about }}
        />
      </div>
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>{firstName}, your profile saved successfully.</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
