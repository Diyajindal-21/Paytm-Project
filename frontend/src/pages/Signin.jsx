import axios from "axios"
import { BottomWarning } from "../components/BootomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { Inputbox } from "../components/Inputbox"
import { Subheading } from "../components/Subheading"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export const Signin=()=>{
    const navigate=useNavigate();
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    return <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                <Heading label={"Sign in"}></Heading>
                <Subheading label={"Enter your credentials to access your account"}></Subheading>
                <Inputbox onChange={(e)=>{
                    setUsername(e.target.value)
                }} placeholder={"email"} label={"Email"}></Inputbox>
                <Inputbox onChange={(e)=>{
                    setPassword(e.target.value)
                }} placeholder={"password"} label={"Password"}></Inputbox>
                <div className="pt-4">
                    <Button onClick={async ()=>{
                        const response=await axios.post("http://localhost:3000/api/v1/user/signin",{
                            username,
                            password
                        })
                        .then(response=>{
                            navigate("/dashboard")
                        })
                    }}
                    label={"Sign in"} ></Button>
                </div>
                <BottomWarning label={"Don't have an account"} buttonText={"Sign up"} to={"/signup"}></BottomWarning>
            </div>
        </div>
    </div>
}