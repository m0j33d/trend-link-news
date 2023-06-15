import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react'
import { connect } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import {  components, default as ReactSelect } from "react-select";
import CreatableSelect from 'react-select/creatable';

import NavBar from '../components/global/NavBar';
import VerifyEmailPrompt from '../components/global/VerifyEmailPrompt';
import { updateUser, updateUserPrefeerrences } from '../services/user'
import { getAuthenticatedUser } from '../services/auth'


const sourceOptions = [
    { value: "newsapi", label: "NewsAPI.org" },
    { value: "nytimes", label: "New York Times" },
    { value: "guardian", label: "The Guardian" },
];

const authorOptions = [
];

const categoryOptions = [
    { value: "sport", label: "Sports" },
    { value: "politics", label: "Politics" },
    { value: "world", label: "World" },
    { value: "business", label: "Business" },
    { value: "tech", label: "Tech" },
    { value: "food", label: "Food" },
    { value: "business", label: "Business" },
];

const Option = (props) => {
    return (
        <div>
            <components.Option {...props}>
                <input
                    type="checkbox"
                    checked={props.isSelected}
                    onChange={() => null}
                />{" "}
                <label>{props.label}</label>
            </components.Option>
        </div>
    );
};

const Settings = ({ logged_in, user, preferences}) => {
    const [update, setUpdate] = useState(false);


    const [sourceSelected, setSourceSelected] = useState(preferences?.sources);
    const [authorSelected, setAuthorSelected] = useState(preferences?.authors);
    const [categorySelected, setCategorySelected] = useState(preferences?.categories);

    const formik = useFormik({
        initialValues: {
            name: user?.name,
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required("Name is requied field")
        }),
        onSubmit: async (values) => {
            const res = await updateUser(values);

            if (!res?.data)  return;

            setUpdate(true)
        }
    })

    useEffect(() => {
        getAuthenticatedUser();

    }, [update]);

    const submitPreferenceForm = async() => {

        const values = {
            'sources' : sourceSelected,
            'authors' : authorSelected,
            'categories' : categorySelected,
        }
        const res = await updateUserPrefeerrences(values);

        if (!res?.data)  return;

        setUpdate(true)
    };

    const handleOptionChange = (selected) => {
        setSourceSelected(selected);
    };

    const handleCategoryChange = (selected) => {
        setCategorySelected(selected);
    };

    const handleAuthorChange = (selected) => {
        setAuthorSelected(selected);
    };

    if (!logged_in) {
        return <Navigate to="/sign-in" />;
    }

    const { values, errors, submitForm, isSubmitting, handleChange } = formik;

    return (
        <>
            <NavBar user={user} />
            <VerifyEmailPrompt user={user} />

            <div className="flex flex-col w-screen h-screen">
                <section className="m-auto text-center px-4 md:p-0 w-full md:w-1/2 max-w-2xl">
                    <p className="text-lg md:text-3xl font-semibold">
                        Profile Information
                    </p>

                    <div className="flex flex-col my-4 md:my-8">
                        <label htmlFor="name" className="form-label"> Name </label>
                        <input
                            placeholder="name"
                            name="name"
                            className="form-input border-[#e6e6e6] border-2"
                            onChange={handleChange}
                            value={values.name}
                        />
                        {errors.name && <span className="error">{errors.name}</span>}

                        <button
                            className="button text-white my-4"
                            onClick={() => {
                                submitForm();
                            }}
                        >
                            {isSubmitting ? "updating..." : "Update Name"}
                        </button>

                    </div>

                   <div>


                   <p className="text-lg md:text-xl font-semibold border-0 pt-4 border-t-2">
                        My Interests / Preferences
                    </p>


                    <div className="flex flex-col my-8 text-left">

                        <span
                            data-toggle="popover"
                            data-trigger="focus"
                            data-content="Please select source(s)"
                        >
                        <label htmlFor="source" className="form-label "> Source(s) </label>
                            <ReactSelect
                                options={sourceOptions}
                                isMulti
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                components={{
                                    Option
                                }}
                                onChange={handleOptionChange}
                                allowSelectAll={true}
                                value={sourceSelected}
                            />
                        </span>

                        <span
                            data-toggle="popover"
                            data-trigger="focus"
                            data-content="Please select category"
                            className='my-8'
                        >
                        <label htmlFor="source" className="form-label "> Category(s) </label>
                            <CreatableSelect
                                options={categoryOptions}
                                isMulti
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                components={{
                                    Option
                                }}
                                onChange={handleCategoryChange}
                                allowSelectAll={true}
                                value={categorySelected}
                            />
                        </span>

                        <span
                            data-toggle="popover"
                            data-trigger="focus"
                            data-content="Please select author(s)"
                        >
                        <label htmlFor="source" className="form-label "> Author(s) </label>
                            <CreatableSelect
                                options={authorOptions}
                                isMulti
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                components={{
                                    Option
                                }}
                                onChange={handleAuthorChange}
                                allowSelectAll={true}
                                value={authorSelected}
                            />
                        </span>

                        <button
                            className="button text-white mt-4"
                            onClick={() => {
                                submitPreferenceForm();
                            }}
                        >
                            {isSubmitting ? "updating..." : "Update Preferences"}
                        </button>

                    </div>
                   </div>

                </section>
            </div>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        logged_in: state?.logged_in,
        user: state?.user,
        preferences: state?.user?.preferences
    };
};

export default connect(mapStateToProps)(Settings);