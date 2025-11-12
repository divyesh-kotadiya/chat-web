import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchComponents/SearchBar";
import Loading from "../components/SearchComponents/Loading";
import User from "../components/SearchComponents/User";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AddUser } from "../services/Actions/Chat/action";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../api/userApi";

export default function Search() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state.chat.AllChats);

  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [resultsEmpty, setResultsEmpty] = useState(false);

  const notify = (value) => {
    return toast.info(`Added ${value}`, {
      position: "bottom-center",
      autoClose: 2222,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  useEffect(() => {
    if (!query) {
      setUsers([]);
      setResultsEmpty(false);
      return;
    }

    const timeout = setTimeout(() => {
      searchHandler(query);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [query]);

  const searchHandler = async (value) => {
    try {
      setIsLoading(true);
      const { data } = await userAPI.searchUsers(value);
      setIsLoading(false);

      data.users.length = data.users.length > 2 ? 2 : data.users.length;
      setUsers(data.users);
      setResultsEmpty(data.users.length === 0);
    } catch (error) {
      console.error("Error searching users:", error);
      setIsLoading(false);
      setResultsEmpty(true);
    }
  };

  const accessChatHandler = (values) => {
    dispatch(AddUser(values, state));
    notify(values.name);
    setTimeout(() => {
      navigate("/home/message", { replace: true });
    }, 2000);
  };

  return (
    <div className="w-[80vw] relative flex flex-col">
      <ToastContainer />
      <SearchBar onChange={(e) => setQuery(e.target.value)} />
      <div className="w-[100%] flex box-border justify-center py-2 relative">
        {!isLoading && resultsEmpty && <p>0 matching results found</p>}
        {isLoading && <Loading />}
        {!isLoading && users.length > 0 && (
          <div className="w-[60%] border-[1px] rounded-md border-[#acacac] px-[1%] py-[1%] flex flex-col">
            {users.map((data, index) => (
              <User
                accessChat={accessChatHandler}
                values={data}
                key={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
