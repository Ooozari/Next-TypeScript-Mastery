'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import * as z from 'zod';
import axios, { AxiosError } from 'axios'
import { useState, useEffect } from 'react';
import { useDebounceCallback } from 'usehooks-ts'
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpValidation } from '@/schemas/signUpSchema';
import { ApiResponse } from '@/types/ApiResponse';





export default function Signup() {
    // States
    // this state is only required because we have to validate the unique username
    const [username, setUsername] = useState('');
    const [usernameMsg, setUsernameMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const debounced = useDebounceCallback(setUsername, 400)
    const router = useRouter()

    // Zod validation
    const signupForm = useForm<z.infer<typeof SignUpValidation>>({
        resolver: zodResolver(SignUpValidation),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    })

    // Sending api request to validate the username
    useEffect(() => {
        const checkUsernameUnique = async () => {
            // IF there is some value in debounce then we want to run the 
            if (debounced) {
                setUsernameMsg('')

                try {
                    //TODO: LOG THIS RESPONSE
                    const response = await axios.get(`/api/unique-username?username=${debounced}`)

                    // setting the username message according to the reponse from the api
                    setUsernameMsg(response.data.message)

                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMsg(axiosError.response?.data.message ?? "Error checking username")
                }
            }

        }
        checkUsernameUnique()
    }, [debounced])

    // Sign-up submit
    const onSubmit = async (data: z.infer<typeof SignUpValidation>) => {
        setIsSubmitting(true)

        try {
            //STEP 1: Sending api request to register user
            const res = await axios.post<ApiResponse>('/api/sign-up', data)

            //STEP 2: sending toast on succes
            toast.success(res.data.message)

            //STEP 3: redirecting user to verify account page after success
            router.replace(`/verify/${username}`)
            //STEP 2: Setting the loader to false
            setIsSubmitting(false)

        } catch (error) {
            console.error("Error is signing in user", error);

            const axiosError = error as AxiosError<ApiResponse>
            const errorMsg = axiosError.response?.data.message || "Something went wrong";
            toast.error(errorMsg);
            setIsSubmitting(false)
        }

    }
    return (
        <>


        </>
    )
}
