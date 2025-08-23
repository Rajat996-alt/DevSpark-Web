import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addRequest, removeRequest } from "../utils/requestSlice";

const Request = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {
      console.log(err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequest(res?.data?.data || []));

      if (!res?.data?.data || res.data.data.length === 0) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (err) {
      console.log(err);
      dispatch(addRequest([]));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!Array.isArray(requests)) return null;

  if (requests.length === 0) {
    return (
      <>
        {showToast && (
          <div className="toast toast-top toast-center">
            <div className="alert alert-error">
              <span>No requests found.</span>
            </div>
          </div>
        )}
        {!showToast && (
          <div className="flex justify-center my-16">
            <h2 className="text-xl font-medium text-gray-400">
              No requests available
            </h2>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-10">
      <h1 className="text-3xl font-semibold text-center mb-6">Requests</h1>

      <ul className="space-y-5">
        {requests.map((request) => {
          const user = request.fromUserId;
          if (!user) {
            return null;
          }
          const { _id, firstName, lastName, photoUrl, age, gender, about } =
            user;

          return (
            <li
              key={_id}
              className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-blue-900 hover:bg-blue-200/30 transition"
            >
              <div className="avatar shrink-0">
                <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-base-300">
                  <img
                    src={photoUrl}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold">{firstName + " " + lastName}</p>
                <p className="text-sm opacity-80">{age + ", " + gender}</p>
                <p className="text-sm opacity-80 truncate">{about}</p>
              </div>

              <div className="card-actions justify-center py-5">
                <button
                  className="btn"
                  onClick={() => reviewRequest("accepted", request._id)}
                >
                  Accept
                </button>
                <button
                  className="btn"
                  onClick={() => reviewRequest("rejected", request._id)}
                >
                  Reject
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Request;
