import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showToast, setShowToast] = useState(false);

  const getFeed = async () => {
    if (Array.isArray(feed) && feed.length > 0) return;

    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data || []));
      setCurrentIndex(0);

      if (!res?.data?.data || res.data.data.length === 0) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (err) {
      console.log("Feed error:", err);
      dispatch(addFeed([]));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!Array.isArray(feed)) return null;

  if (feed.length === 0) {
    return (
      <>
        {showToast && (
          <div className="toast toast-top toast-center">
            <div className="alert alert-error">
              <span>No profiles found.</span>
            </div>
          </div>
        )}
        {!showToast && (
          <div className="flex justify-center my-16">
            <h2 className="text-xl font-medium text-gray-400">
              No profiles available
            </h2>
          </div>
        )}
      </>
    );
  }

  const handleAction = () => {
    if (currentIndex < feed.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setCurrentIndex(-1);
    }
  };

  if (currentIndex === -1) {
    return (
      <div className="toast toast-top toast-center">
        <div className="alert alert-info">
          <span>You have seen all profiles.</span>
        </div>
      </div>
    );
  }

  const currentUser = feed[currentIndex];
  if (!currentUser) return null;

  return (
    <div className="flex justify-center my-16">
      <UserCard user={currentUser} onAction={handleAction} />
    </div>
  );
};

export default Feed;
