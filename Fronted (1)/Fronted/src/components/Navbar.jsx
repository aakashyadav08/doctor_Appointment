import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

export const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);

  const logout = () => {
    setToken(false); 
    localStorage.removeItem("token");  

    navigate("/");  
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-gray-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="w-44 cursor-pointer"
      />
      <ul className="hidden md:flex justify-start gap-5 font-medium">
        <NavLink to="/">
          <li>HOME</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/doctors">
          <li>ALL DOCTOR</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/about">
          <li>ABOUT</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/contact">
          <li>CONTACT</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
      </ul>
      <div className="flex items-center gap-4">
        {
          token && userData
            ? (
              <div className="flex items-center gap-2 cursor-pointer group relative">
                <img className="w-8 rounded-full" src={userData.image} alt="" />
                <img className="w-2.5" src={assets.dropdown_icon} alt="" />
                <div className="absolute text-start top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
                  <div className="flext flex-col min-w-48 bg-stone-100 gap-5 p-4 rounded justify-start items-start">
                    <p
                      onClick={() => navigate("my-profile")}
                      className="hover:text-black cursor-pointer"
                    >
                      My Profile
                    </p>
                    <p
                      onClick={() => navigate("my-appointments")}
                      className="hover:text-black cursor-pointer"
                    >
                      My Appointment
                    </p>
                    <p onClick={logout} className="hover:text-black cursor-pointer">Logout</p>
                  </div>
                </div>
              </div>
            ) : (
              <button onClick={() => navigate('/login')} className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block">
                Create Account/Login
              </button>
            )
        }
        <img className="md:hidden" onClick={() => setShowMenu(true)} src={assets.menu_icon} alt="" />
        {/* ---------------- Mobile Menu ------------------ */}
        <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden top-0 right-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
          <div className="flex items-center justify-between px-5 py-6">
            <img className="w-32" src={assets.logo} alt="" />
            <img className="w-7" onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="" />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink onClick={() => setShowMenu(false)} to='/'><p className="px-4 py-2 rounded inline-block">Home</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/doctors'><p className="px-4 py-2 rounded inline-block">All Doctors</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/about'><p className="px-4 py-2 rounded inline-block">About</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/contact'><p className="px-4 py-2 rounded inline-block">Contact</p></NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};
