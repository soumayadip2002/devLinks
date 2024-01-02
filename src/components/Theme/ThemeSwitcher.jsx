import React, { useEffect, useState } from "react";
import { PiSunFill } from "react-icons/pi";
import { MdDarkMode } from "react-icons/md";
import { DATABASE_ID, USERS_ID, databases } from "../../lib/appwriteConfig";
import { useAuth } from "../../utils/AuthContext";
import { Query } from "appwrite";
import { addTheme } from "../../redux/slices/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";

const ThemeSwitcher = () => {
  //onst [theme, setTheme] = useState(null);
  const theme = useSelector((state) => state.global.theme);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const getTheme = async () => {
    try {
      const response = await databases.listDocuments(DATABASE_ID, USERS_ID, [
        Query.equal("username", `@${user.name}`),
      ]);

      if (response.documents) {
        if (response.theme !== "") {
          dispatch(addTheme(response.documents[0].theme));
        } else {
          dispatch(
            addTheme(
              window.matchMedia("(prefers-color-scheme:dark)").matches()
                ? "dark"
                : "light"
            )
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTheme();
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleTheme = async () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    dispatch(addTheme(newTheme));
    if (user) {
      await databases.updateDocument(DATABASE_ID, USERS_ID, user.$id, {
        theme: newTheme,
      });
    }
  };

  return (
    <div
      className={`h-[1.8rem] sm:h-[1.5rem] sm:w-[2.8rem] w-[3.5rem] 
      cursor-pointer  p-1 rounded-2xl flex items-center ${
        theme === "dark"
          ? "justify-start bg-[#413f30]"
          : "justify-end bg-[#e1d8f8]"
      } transition-all duration-300 ease-in`}
      onClick={handleTheme}
    >
      <button className={`cursor-pointer text-2xl sm:text-lg  flex `}>
        <p>
          {theme === "light" ? (
            <MdDarkMode className="text-indigo-700" />
          ) : (
            <PiSunFill className="text-amber-300" />
          )}
        </p>
      </button>
    </div>
  );
};

export default ThemeSwitcher;
