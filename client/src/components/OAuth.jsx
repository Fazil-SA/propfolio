import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { axiosInstance } from '../../../api/instance/axios';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlicer';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      console.log(result);
      const AuthCred = {
        userName: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL
      }
      axiosInstance.post('/api/auth/google', AuthCred, {withCredentials: true}).then((res) => {
        dispatch(signInSuccess(res.data._doc));
        navigate('/');
      })
    } catch(error) {
        console.log('Could not sign in with google', error);
    }
  } 
  return (
    <button onClick={handleGoogleClick} type="button" className="bg-red-700  p-3 rounded-lg text-white uppercase hover:opacity-95">Continue with google</button>
  )
}
