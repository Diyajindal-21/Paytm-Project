import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { Heading } from "../components/Heading";
import { Subheading } from "../components/Subheading";
import { Inputbox } from "../components/Inputbox";
import { Button } from "../components/Button";
import axios from "axios";
import { BottomWarning } from "../components/BootomWarning";


export const Signup=()=>{
    const [firstName,setfirstName]=useState("");
    const [lastName,setlastName]=useState("");
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const navigate=useNavigate();
    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <Heading label={"Sign up"}></Heading>
                    <Subheading label={"Enter your information to create an account"}></Subheading>
                    <Inputbox onChange={(e)=>{
                        setfirstName(e.target.value);
                    }} placeholder={"first name"} label={"First Name"}></Inputbox>
                    <Inputbox onChange={(e)=>{
                        setlastName(e.target.value);
                    }} placeholder={"last name"} label={"Last Name"}></Inputbox>
                    <Inputbox onChange={(e)=>{
                        setUsername(e.target.value);
                    }} placeholder={"email"} label={"Username"}></Inputbox>
                    <Inputbox onChange={(e)=>{
                        setPassword(e.target.value);
                    }} placeholder={"password"} label={"Password"}></Inputbox>
                    <div className="pt-4">
                        <Button onClick={async()=>{
                            const response=await axios.post("http://localhost:3000/api/v1/user/signup",{
                                username,
                                password,
                                firstName,
                                lastName
                            });
                            localStorage.setItem("token",response.data.token)
                            navigate("/dashboard")
                        }} label={"Sign up"}></Button>
                    </div>
                    <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"}></BottomWarning>
                </div>
            </div>
        </div>
    )
}