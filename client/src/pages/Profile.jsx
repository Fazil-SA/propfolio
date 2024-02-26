import { useSelector } from "react-redux"

function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="font-semibold text-3xl my-3 text-center">Profile</h1>
      <form className="flex flex-col">
        <img className="w-24 h-24 mt-2 object-cover cursor-pointer self-center rounded-full" src={currentUser.photo} alt="profile" />
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