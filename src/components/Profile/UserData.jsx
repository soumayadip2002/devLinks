import React, { useRef, useState } from "react";
import { BsImage } from "react-icons/bs";
import { addUserData } from "../../redux/slices/global/globalSlice";
import { useSelector, useDispatch } from "react-redux";
import { uploadFile } from "../../CRUD/userCrud";
import { useAuth } from "../../utils/AuthContext";
import ImageLoading from "../Loading/ImageLoading";
import toast from "react-hot-toast";
const UserData = () => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  const userProfile = useSelector((state) => state.global.user);
  const dispatch = useDispatch();

  const handleImageUpload = async (e) => {
    setLoading(true);
    try {
      if (e.target.files[0]) {
        await uploadFile(e.target.files[0], user, userProfile, dispatch);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-2 gap-y-[1.5rem] h-full mt-[3rem]">
      <div className="bg-[#fafafa] dark:bg-[#111] h-[13rem] sm:h-auto lg:h-auto flex items-center px-[1.5rem] rounded-lg sm:py-[1.5rem] lg:py-[2rem]">
        <div
          className="grid grid-cols-3 gap-x-[3rem] items-center sm:grid-cols-1 lg:grid-cols-1
        text-gray-600 dark:text-gray-400"
        >
          <p className="text-[15px]  sm:mb-[1rem] lg:mb-[1rem]">
            Profile picture
          </p>
          <div
            className="flex flex-col justify-center items-center cursor-pointer 
            bg-[#efebff] dark:bg-[#222] h-[100%] px-[1rem] py-[3.5rem] text-indigo-600 font-bold rounded-lg sm:h-full lg:h-full sm:w-[70%] lg:w-[70%]"
            onClick={handleFileUpload}
          >
            {!loading ? (
              <>
                <BsImage className="text-[2rem]" />
                <p className="text-[15px] mt-[.7rem]">+ Upload Image</p>
              </>
            ) : (
              <ImageLoading />
            )}
          </div>
          <p className="text-[12px]  sm:mt-[1rem] lg:mt-[1rem]">
            Image must be below 1024x1024px. Use JPG, JPEG, PNG, or GIF format.
          </p>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".png, .jpg, .jpeg, .gif"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (file) {
                // Check file size (1MB = 1024 * 1024 bytes)
                if (file.size > 1024 * 1024) {
                  toast.error("File size exceeds 1MB");
                  return;
                }

                // Check image dimensions
                const img = new Image();
                img.src = URL.createObjectURL(file);
                img.onload = function () {
                  if (this.width > 1024 || this.height > 1024) {
                    toast.error("Image dimensions exceed 1024x1024");
                    return;
                  }

                  // If file size and dimensions are ok, handle the image upload
                  handleImageUpload(e);
                };
              }
            }}
          />
        </div>
      </div>

      <div
        className="bg-[#fafafa] dark:bg-[#111] h-[13rem] sm:h-auto 
      text-gray-600 dark:text-gray-300 lg:h-auto grid items-center px-[1.5rem] lg:py-[1rem] rounded-lg"
      >
        <div className="grid grid-cols-[6.7rem,auto] gap-x-[2rem] items-center sm:grid-cols-1 lg:grid-cols-1 gap-y-[1rem]">
          <label htmlFor="fname" className="text-[.8rem] ">
            Firstname
          </label>
          <input
            maxLength={16}
            type="text"
            name="fname"
            placeholder=".e.g. Rajarshi"
            className="w-[100%] p-[10px] border-[1px] border-gray-400
            dark:bg-black dark:border-gray-600
            rounded-lg outline-[1px] outline-indigo-600"
            value={userProfile.fname}
            onChange={(e) => {
              dispatch(addUserData({ user: { fname: e.target.value } }));
            }}
          />
        </div>

        <div className="grid grid-cols-[6.7rem,auto] gap-x-[2rem] items-center sm:grid-cols-1 gap-y-[1rem] lg:grid-cols-1">
          <label htmlFor="lname" className="text-[.8rem] ">
            Lastname
          </label>
          <input
            maxLength={16}
            type="text"
            name="lname"
            placeholder=".e.g. Samaddar"
            className="w-[100%] p-[10px] border-[1px] border-gray-400 dark:bg-black dark:border-gray-600
            rounded-lg outline-[1px] outline-indigo-600"
            value={userProfile.lname}
            onChange={(e) => {
              dispatch(addUserData({ user: { lname: e.target.value } }));
            }}
          />
        </div>

        <div className="grid grid-cols-[6.7rem,auto] gap-x-[2rem] items-center sm:grid-cols-1 gap-y-[1rem] lg:grid-cols-1">
          <label htmlFor="bio" className="text-[.8rem]  w-full">
            Add Bio
          </label>
          <input
            type="text"
            maxLength={200}
            name="bio"
            placeholder=".e.g. Student"
            className="w-[100%] p-[10px] border-[1px] border-gray-400 dark:bg-black dark:border-gray-600
            rounded-lg outline-[1px] outline-indigo-600 h-[4rem]"
            value={userProfile.bio}
            onChange={(e) => {
              dispatch(addUserData({ user: { bio: e.target.value } }));
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UserData;
