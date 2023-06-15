import { useFormik } from "formik";
import * as Yup from "yup";
import { Navigate, Link } from "react-router-dom";
import { useState } from "react";
import { store } from "../redux/store";

import { login } from "../services/auth"


export default function Login() {
    const [redirect, setRedirect] = useState(false);
    const logged_in =  store.getState().logged_in;

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .required("email is requied field")
                .email("please enter correct email"),
            password: Yup.string()
                .required("password is required")
                .min(6, "password must be of 6 characters")
        }),
        onSubmit: async (values) => {
            try{
                const res = await login(values);
                if (!res?.status)  return;
                setRedirect(true);  
            }catch(e){
                console.log(e)
            }
        }
    })

    if (logged_in) return <Navigate to="/feed" />

    if (redirect) return <Navigate to="/feed" />;

    const { values, errors, submitForm, isSubmitting, handleChange } = formik;


    return (
        <>
            <div className="flex flex-col w-screen h-screen">
                <section className="m-auto text-center md:w-96 max-w-2xl">
                    <p className="logo-text">TrendLinkNews</p>

                    <h2 >Sign in to TrendLinkNews</h2>
                    <p className="font-thin">
                        Latest and trending news article at your fingertip
                    </p>

                    <div className="flex flex-col my-8">
                        <label htmlFor="email" className="form-label" >Email</label>
                        <input
                            placeholder="email"
                            name="email"
                            className="form-input"
                            onChange={handleChange}
                            value={values.email}
                        />
                        {errors.email && <span className="error">{errors.email}</span>}

                        <label htmlFor="password" className="form-label" >Password</label>
                        <input
                            value={values.password}
                            name="password"
                            type="password"
                            className="form-input"
                            placeholder="password"
                            onChange={handleChange}
                        />
                        {errors.password && <span className="error">{errors.password}</span>}

                        <button
                            className="button my-4"
                            onClick={() => {
                                submitForm();
                            }}
                        >
                            {isSubmitting ? "loading..." : "Submit"}
                        </button>
                       <Link to="/forgot-password" className="underline text-blue-900 hover:text-slate-400 font-light py-2 text-base"> Forgot password?</Link>

                    </div>

                    <p className="text-slate-400 font-light py-2 text-base">Don't have an account? <Link to="/sign-up" className="underline text-blue-900 hover:text-slate-400"> Sign up</Link></p>

                </section>

            </div>
        </>
    )
}