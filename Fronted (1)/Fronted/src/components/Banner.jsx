import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

export const Banner = () => {
  const navigate = useNavigate();
  return (
    <div className="flex bg-primary rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10 ">
      {/* ----------left--------- */}
      <div className="flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5">
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white  ">
          <p>Book Appointment</p>
          <p>With 100+ Trusted Doctors</p>
        </div>
        <button
          onClick={() => {
            navigate("/login");
            scrollTo(0, 0);
          }}
          className="flex items-center text-sm sm:text-base text-gray-600 bg-blue-50 py-3 px-8 rounded-full mt-6 hover:scale-105 transition-all duration-200"
        >
          Create Account
        </button>
      </div>

      {/* ------------Right--------- */}
      <div className="hidden md:block md:w-1/2 lg:w-[370px] relative ">
        <img
          className="w-full absolute right-0 bottom-0 max-w-md"
          src={assets.appointment_img}
          alt=""
        />
      </div>
    </div>
  );
};
