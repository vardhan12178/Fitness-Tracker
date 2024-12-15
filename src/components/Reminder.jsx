import  { useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Reminder = () => {
  useEffect(() => {
    const reminderInterval = setInterval(() => {
      toast.info("Don't forget to log your activities today!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }, 86400000); 

    return () => clearInterval(reminderInterval); 
  }, []);

  return null;
};

export default Reminder;
