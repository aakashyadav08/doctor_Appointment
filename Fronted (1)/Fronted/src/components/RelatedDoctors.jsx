/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom';

export const RelatedDoctors = ({speciality,docId}) => {

    const { doctors} = useContext(AppContext)
    const [reltDocs, setReltDocs] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {

        if(doctors.length > 0 && speciality){
            const doctorsData = doctors.filter(docs => docs.speciality === speciality && docs._id !== docId)
            console.log("doctorsData", doctorsData);
            setReltDocs(doctorsData)
        
        }
        

    },[speciality, doctors, docId])
  return (
    <div className="flex flex-col items-center gap-4 text-gray-900 md:mx-10 my-16">
    <h1 className="text-3xl font-medium">Top Doctors to Book</h1>
    <p className="sm:w-1/3 text-center text-sm">
      Simply browse through our extensive list of trusted doctors.
    </p>

    <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0 ">
      {reltDocs.slice(0, 5).map((item, index) => (
        <div
          onClick={() =>{ navigate(`/appointment/${item._id}`); scrollTo(0,0)}}
          className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
          key={index}
        >
          <img className="bg-blue-50" src={item.image} alt="" />
          <div className="p-4">
            <div className="flex items-center text-sm gap-2 text-green-500">
              <p className="w-2 h-2 rounded-full bg-green-500"></p>
              <p>Available</p>
            </div>
            <p className="text-gray-900 text-lg font-medium">{item.name}</p>
            <p className="text-gray-600 text-sm">{item.speciality}</p>
          </div>
        </div>
      ))}
    </div>
    <button
      onClick={() => {
        navigate("/doctors");
        scrollTo(0, 0);
      }}
      className="bg-blue-100 text-gray-600 px-12 py-3 rounded-full mt-10 hover:translate-y-[-10px] transition-all duration-500"
    >
      More
    </button>
  </div>
  )
}
