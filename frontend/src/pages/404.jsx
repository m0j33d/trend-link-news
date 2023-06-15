import {
    Link,
    useNavigate,
} from 'react-router-dom';


export default function NotFound() {
    const navigate = useNavigate();

    return (
        <>
            <div className="conatiner flex flex-col w-screen h-screen ">
                <section className="m-auto text-center md:w-96 max-w-2xl">
                    <Link to="/feed">
                        <p className="logo-text">TrendLinkNews</p>
                    </Link>

                    <span className="mt-12 text-5xl font-bold"> 404</span>


                    <p className="mb-12">Page not found</p>

                    <p className="font-light hover:underline cursor-pointer" onClick={() => navigate(-1)}>
                        &#8592; Go back
                    </p>

                </section>

            </div>
        </>
    )
}