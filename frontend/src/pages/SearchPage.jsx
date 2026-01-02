// ...existing code...
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { AuthDataContext } from "../context/AuthContext";
import { setSearchData } from "../redux/userSlice.js";
const SearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { serverUrl } = useContext(AuthDataContext);
  const dispatch = useDispatch();
  const searchData = useSelector((state) => state.user.searchData);
  const params = useParams();
  const handleSubmit = async (e) => {
    try {
      
      const result = await axios.get(
        `${serverUrl}/api/user/search?query=${query}`,
        {
          withCredentials: true,
        }
      );
      dispatch(setSearchData(result.data.users));
      console.log("Search results:", result.data.users);
      // Dispatch action to store search results in Redux if neede
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };
  useEffect(() => {
    handleSubmit();
  }, [query]);
  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-md bg-white border border-gray-200 text-purple-600 hover:bg-purple-50 shadow-sm"
          aria-label="Back"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Search</h1>
      </div>

      <form className="flex gap-2 mb-4" >
        <div className="flex-1 relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or username"
            autoFocus
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
              aria-label="Clear"
            >
              Clear
            </button>
          )}
        </div>
        {!query && (
          <button
            onClick={() => setQuery("")}
            className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-purple-600 hover:bg-purple-50"
            aria-label="Empty"
          >
            Go
          </button>
        )}
      </form>

      <div className="min-h-[240px] rounded-lg border border-gray-100 p-4 bg-white shadow-sm">
        {!query ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <svg
              className="w-12 h-12 mb-3 text-purple-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
              />
            </svg>
            <p className="text-sm">
              Type a name or username to search. UI styled to match app colors.
            </p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-3">
              Showing results for{" "}
              <span className="font-medium text-gray-800">"{query}"</span>
            </p>
            <ul className="space-y-2">
              {searchData.map((user) => (
                <li
                  key={user.id}
                  onClick={() => navigate(`/profile/${user.userName}`)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <img
                    src={user.profileImage || "image.png"} 
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-800">
                        {user.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {user.username}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{user.bio}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
