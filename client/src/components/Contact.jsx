import { useState, useEffect } from 'react'
import { axiosInstance } from '../instance/axios';
import { Link } from 'react-router-dom';

function Contact({listing}) {
  const [message, setMessage] = useState('');
  const [landlord, setLandlord] = useState('');
  useEffect(() => {
    try {
      axiosInstance.get(`/api/user/${listing.userRef}`, {withCredentials: true})
      .then((res) => {
        setLandlord(res.data._doc)
      })
    } catch (error) {
      console.log(error)
    }
  }, [listing.userRef]);
  return (
    <>
      <textarea type="textarea" value={message} placeholder='type your message...' onChange={(e) => setMessage(e.target.value)} rows='2' id='message' className='p-3 w-full border rounded-lg mt-2'/>
      <Link
          to={`mailto:${landlord.email}?subject=Regarding ${listing.title}&body=${message}`}
          className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
          >
            Send Message          
          </Link>
    </>
  )
}

export default Contact