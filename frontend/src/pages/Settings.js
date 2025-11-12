import React, { useState } from "react";
import Profile from "../components/SettingsComponents/Profile";
import InputName from "../components/SettingsComponents/InputName";
import InputEmail from "../components/SettingsComponents/InputEmail";
import { setUser } from "../services/Actions/User/actions";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import InfoIcon from "@mui/icons-material/Info";
import { userAPI } from "../api/userApi";

export default function Settings() {
  const dispatch = useDispatch();
  const storedData = JSON.parse(localStorage.getItem("info"));
  const [name, setName] = useState(storedData.name);
  const [email, setEmail] = useState(storedData.email);

  const resetData = () => {
    setName(storedData.name);
    setEmail(storedData.email);
  };

  const notify = (type) => {
    const opts = {
      position: "top-center",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    };
    type === "error"
      ? toast.error("Something went wrong!", opts)
      : toast.success("Successfully updated!", opts);
  };

  const updateHandler = async () => {
    try {
      const { data } = await userAPI.updateMe({ name, email });
      if (data.status === "success") {
        dispatch(setUser(data.updatedUser));
        notify("success");
      } else {
        notify("error");
      }
    } catch (err) {
      console.error(err);
      notify("error");
    }
  };

  return (
    <div className="grid w-[80vw] relative grid-rows-[1fr,7fr]">
      <div className="border-[1px] border-[#f5f5f5]"></div>
      <div className="border-[1px] border-[#f5f5f5]">
        <ToastContainer />
        <div className="px-[5%] py-[2%]">
          <div className="font-Poppins max-[1024px]:text-xl font-semibold text-2xl">
            Public profile
          </div>
          <div className="flex items-center mt-2">
            <InfoIcon fontSize="10" color="info" />
            <div className="font-Poppins text-xs">
              To update your profile picture, select an image and upload it.
            </div>
          </div>
          <Profile />
          <div className="mt-[3%] flex flex-col gap-8">
            <InputName name={name} setName={setName} />
            <InputEmail email={email} setEmail={setEmail} />
          </div>
          <div className="flex flex-row mt-[2%] gap-2">
            <div
              onClick={updateHandler}
              className="bg-[#202142] hover:bg-[#202162] text-white font-medium cursor-pointer border-[#000000] px-4 py-2 max-[1024px]:px-2 max-[1024px]:py-1 max-[1024px]:text-sm rounded-md font-Roboto tracking-tight"
            >
              Update
            </div>
            <div
              onClick={resetData}
              className="bg-[#C6CED1] text-white font-medium cursor-pointer border-[#000000] px-4 py-2 rounded-md font-Roboto tracking-tight max-[1024px]:px-2 max-[1024px]:py-1 max-[1024px]:text-sm"
            >
              Reset
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
