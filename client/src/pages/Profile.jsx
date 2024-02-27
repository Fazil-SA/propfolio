import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart,
         deleteUserSuccess, deleteUserFailure, signOutUserStart, signOutUserSuccess,
         signOutUserFailure  } from "../redux/user/userSlicer";
import { axiosInstance } from "../../../api/instance/axios";
import { Link } from "react-router-dom";

function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    // When file changes start uploading so to detect changing write inside useEffect
    if(file) {
      handleFileUpload(file);
    }
  }, [file]);
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress))
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, photo: downloadURL })
        })
      }
    );
  }
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    axiosInstance.post(`/api/user/update/${currentUser._id}`, formData, {withCredentials: true})
    .then((res) => {
      if(res.success == false) {
        dispatch(updateUserFailure(error.message));
      }
      dispatch(updateUserSuccess(res.data));
      setUpdateSuccess(true);
    }).catch((error) => {
      dispatch(updateUserFailure(error.message));
    })
  }

  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(deleteUserStart());
    axiosInstance.post(`/api/user/delete/${currentUser._id}`, {}, {withCredentials: true})
    .then(() => {
      dispatch(deleteUserSuccess());
    }).catch((error) => {
      dispatch(deleteUserFailure(error.message));
    })
  }

  const handleSignOut = (e) => {
    e.preventDefault();
    dispatch(signOutUserStart());
    axiosInstance.get(`/api/auth/signout/${currentUser._id}`, {}, {withCredentials: true})
    .then(() => {
      dispatch(signOutUserSuccess());
    }).catch((error) => {
      dispatch(signOutUserFailure(error.message));
    })
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="font-semibold text-3xl my-3 text-center">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input ref={fileRef} onChange={(e) => setFile(e.target.files[0])} type="file" accept="image/*" hidden/>
        {/* Clicking image open up file upload by reffering to file input type */}
        <img onClick={() => fileRef.current.click()} className="w-24 h-24 mt-2 object-cover cursor-pointer self-center rounded-full" src={formData.photo || currentUser.photo} alt="profile" />
        <p className="text-sm self-center">
        {
          fileUploadError ?
          <span className="text-red-700">Error Image upload(image must be less than 2mb)</span>
          :
          filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ''
          )
        }
        </p>
        <input onChange={handleChange} type="text" defaultValue={currentUser.userName} placeholder="username" id="userName" className="mt-3 p-3 border rounded-lg" />
        <input onChange={handleChange} type="text" defaultValue={currentUser.email} placeholder="email" id="email" className="mt-3 p-3 border rounded-lg" />
        <input onChange={handleChange} type="text" placeholder="password" id="password" className="mt-3 p-3 border rounded-lg" />
        <button className="uppercase bg-slate-700 hover:opacity-95 w-full mt-3 p-3 rounded-lg text-white">{loading ? "Loading..." : "Update"}</button>
        <Link to={'/create-listing'} className="uppercase bg-green-700 hover:opacity-95 w-full mt-6 p-3 rounded-lg text-white text-center">Create Listing</Link>
      </form>
      <div className="flex justify-between mt-3">
        <span onClick={handleDelete} className="text-red-600 cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut} className="text-red-600 cursor-pointer">Sign Out</span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      <p className="text-green-700 mt-5">{updateSuccess ? 'User is updated successfully' : ''}</p>
    </div>
  )
}

export default Profile