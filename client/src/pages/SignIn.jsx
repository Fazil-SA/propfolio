import { useState } from "react"
import { Link } from "react-router-dom"
import { axiosInstance } from "../../../api/instance/axios";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.id] : e.target.value,
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    axiosInstance.post('/api/auth/signin', form)
      .then(() => {
        setLoading(false);
        navigate('/');
      }).catch((error) => {
        if(error.response.data.success === false) {
          setLoading(false);
          setError(error.response.data.message);
          return;
        }
      })
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="text" placeholder='email' onChange={handleChange} id='email' className="rounded-lg border p-3"/>
        <input type="text" placeholder='password' onChange={handleChange} id='password' className="rounded-lg border p-3"/>
        <button className="bg-slate-700 text-white p-3 rounded-md uppercase hover:opacity-95 disabled:opacity-80">{loading ? "loading..." : "Sign in"}</button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  )
}

export default SignIn;