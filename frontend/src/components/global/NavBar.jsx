import { Link } from "react-router-dom";
import { logout } from "../../services/auth";
import { showAlert } from "../../utils/utils";

export default function Navbar({ user }) {

  const handleLogout = async () => {
    try {
      const res = await logout();

      if (!res?.status)
        showAlert({
          msg: res?.data?.message ?? "An error occurred",
          type: "danger",
        });

    } catch (e) {
      showAlert({
        msg: e.message ?? "An error occurred",
        type: "danger",
      });
    }
  };

  return (
    <>
      <nav className="flex flex-row justify-between border w-screen">
        <section>
          <Link to="/feed" >
            <p className="logo-text m-4 md:m-6 md:mx-12 pb-0 ">TrendLinkNews</p>
          </Link>
        </section>

        <section className="m-4 flex flex-row md:m-6 md:mx-12">

          <Link to="/profile-settings">
            <div className="flex flex-row">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Profile</span>
            </div>
          </Link>

          <p onClick={handleLogout} className="md:ml-12 ml-2 text-red-400 cursor-pointer"> Logout </p>

        </section>
      </nav>
    </>
  );
};
