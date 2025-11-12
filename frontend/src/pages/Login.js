import React from 'react'
import Main from '../components/LoginComponents/Main'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { userAPI } from '../api/userApi';


const notify = (message) => {

  return toast.error(message, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    });
};


export default function Login() {
  return (
    <GoogleOAuthProvider clientId="438058612514-mr6pvrfg97crajaid4grj88l95vo8u82.apps.googleusercontent.com">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        />
      <Main></Main>
    </GoogleOAuthProvider>
  )
}

export async function action({ request }) {
  const data = await request.formData();
  const authData = {
    email: data.get("email"),
    password: data.get("password"),
    pic: data.get("pic"),
  };

  const isGoogleAuth = data.get("name");

  try {
    let responseData;

    responseData = (await userAPI.login(authData)).data;

    if (responseData.status !== "fail") {
      localStorage.setItem("jwt", responseData.token);
      return redirect("/home/message");
    }

    if (isGoogleAuth) {
      const authData2 = { ...authData, name: isGoogleAuth };
      responseData = (await userAPI.signup(authData2)).data;

      if (responseData.status === "fail") {
        notify("Something went wrong");
        return null;
      }

      localStorage.setItem("jwt", responseData.token);
      return redirect("/home/message");
    }

    notify("Invalid credentials");
    return null;
  } catch (error) {
    console.error("Auth error:", error);
    notify("Something went wrong");
    return null;
  }
}