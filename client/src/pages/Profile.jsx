import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase"

function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
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
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="font-semibold text-3xl my-3 text-center">Profile</h1>
      <form className="flex flex-col">
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
        <input type="text" placeholder="username" className="mt-3 p-3 border rounded-lg" />
        <input type="text" placeholder="email" className="mt-3 p-3 border rounded-lg" />
        <input type="text" placeholder="password" className="mt-3 p-3 border rounded-lg" />
      </form>
      <button className="uppercase bg-slate-700 hover:opacity-95 w-full mt-3 p-3 rounded-lg text-white">Update</button>
      <button className="uppercase bg-green-700 hover:opacity-95 w-full mt-3 p-3 rounded-lg text-white">Create Listing</button>
      <div className="flex justify-between mt-3">
        <p className="text-red-600 cursor-pointer">Delete Account</p>
        <p className="text-red-600 cursor-pointer">Sign Out</p>
      </div>
    </div>
  )
}

export default Profile