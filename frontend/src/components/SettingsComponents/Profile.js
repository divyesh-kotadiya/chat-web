import React, { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../services/Actions/User/actions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userAPI } from "../../api/userApi";

export default function Profile() {
  const dispatch = useDispatch();
  const dataredux = useSelector((state) => state.user.userInfo);
  const data = JSON.parse(localStorage.getItem("info"));
  
  const [pic, setPic] = useState(data.pic);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (dataredux) setPic(dataredux.pic);
  }, [dataredux]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.warning("Please select an image to upload.", { position: "bottom-center" });
      return;
    }

    const isConfirmed = window.confirm("Are you sure you want to upload this image?");
    if (!isConfirmed) return;

    const formData = new FormData();
    formData.append("photo", selectedFile);

    try {
      const { data } = await userAPI.uploadPhoto(formData);
      dispatch(setUser(data.data.user));
      toast.success("Image uploaded successfully!", { position: "bottom-center" });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.", { position: "bottom-center" });
    }
  };

  // Build proper image path if stored locally
  let image = pic;
  if (pic.startsWith("user")) {
    image = `${process.env.REACT_APP_API_URL}/${pic}`;
  }

  return (
    <div className="flex flex-row items-center gap-10 mt-[2%]">
      <Avatar
        referrerPolicy="no-referrer"
        alt="User-pic"
        sx={{ width: 150, height: 150 }}
        src={image}
      />
      <div className="flex justify-center flex-col gap-5">
        <label
          htmlFor="fileInput"
          className="bg-[#202142] hover:bg-[#202162] text-white cursor-pointer px-4 py-2 rounded-md font-Roboto tracking-tight max-[1024px]:px-2 max-[1024px]:py-1 max-[1024px]:text-sm"
        >
          Select Picture
        </label>
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleFileChange}
        />
        <div
          onClick={handleUpload}
          className="font-medium border-[1px] cursor-pointer border-[#000000] px-4 py-2 rounded-md font-Roboto tracking-tight max-[1024px]:px-2 max-[1024px]:py-1 max-[1024px]:text-sm"
        >
          Upload Picture
        </div>
      </div>
    </div>
  );
}
