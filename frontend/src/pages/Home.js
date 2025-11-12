import React, { useEffect } from 'react'
import NavBar from '../components/HomeComponents/NavBar'
import Description from '../components/HomeComponents/Description'
import Service from './Service'
import { useState } from 'react'
import LoadingPage from './LoadingPage'

import { useNavigate } from 'react-router-dom'
import { userAPI } from '../api/userApi'
import { useDispatch } from 'react-redux'
import { setUser } from '../services/Actions/User/actions'

export default function Home() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading,setIsLoading]=useState(true);

  useEffect(()=>{
    
    const checkIfLoggedIn=async()=>{

      try {
         setIsLoading(true);

         const { data } =await userAPI.protect();

        if(data.status==='success')
        {
            navigate('/home/message',{replace:true})
        }
        else{
            setIsLoading(false);
            dispatch(setUser(data.user));
        }
      } catch (error) {
           setIsLoading(false);
      }
    }
  
    checkIfLoggedIn()

  },[navigate])

  return (
     <div>
      {isLoading&&<LoadingPage></LoadingPage>}
      {!isLoading&&(<><div className='h-[100vh] px-40 py-5 max-[885px]:px-20 max-[653px]:px-14 bg-[#012478]'>
        <NavBar/>
        <Description></Description>
     </div>
     <Service></Service></>)}
     </div>
  )
}
