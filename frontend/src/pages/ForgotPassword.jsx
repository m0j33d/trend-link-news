import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Navigate } from "react-router-dom";

import { forgotPassword } from "../services/auth";


export default function ForgotPassword() {
    const [redirect, setRedirect] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .required("email is requied field")
                .email("please enter correct email"),
        }),
        onSubmit: async (values) => {
            const res = await forgotPassword(values);

            if (!res?.data)  return;
            
            setRedirect(true);   

        }
    })

    if (redirect) return <Navigate to="/sign-in" />;


    const { values, errors, submitForm, isSubmitting, handleChange } = formik;

    return (
        <>
            <div className="conatiner flex flex-col w-screen h-screen ">
                <section className="m-auto text-center md:w-96 max-w-2xl">
                    <p className="logo-text">TrendLinkNews</p>

                    <h2> Retrieve your TrendLinkNews account</h2>
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
                       
                        <button
                            className="button"
                            onClick={() => {
                                submitForm();
                            }}
                        >
                            {isSubmitting ? "loading..." : "Submit"}
                        </button>
                    </div>

                </section>

            </div>
        </>
    )
}