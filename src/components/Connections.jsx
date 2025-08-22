import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data || []));

      if (!res.data.data || res.data.data.length === 0) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (err) {
      console.log(err.message);
      dispatch(addConnections([]));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!Array.isArray(connections)) return null;

  if (connections.length === 0) {
    return (
      <>
        {showToast && (
          <div className="toast toast-top toast-center">
            <div className="alert alert-error">
              <span>No connections found.</span>
            </div>
          </div>
        )}
        {!showToast && (
          <div className="flex justify-center my-16">
            <h2 className="text-xl font-medium text-gray-400">
              No connections available
            </h2>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-10">
      <h1 className="text-3xl font-semibold text-center mb-6">Connections</h1>

      <ul className="space-y-5">
        {connections.map((connection) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } =
            connection;

          return (
            <li
              key={_id}
              className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-blue-900 hover:bg-blue-200/30 transition"
            >
              <div className="shrink-0">
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
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Connections;
