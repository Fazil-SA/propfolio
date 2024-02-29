import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { axiosInstance } from "../instance/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';

function Listing() {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const listingId = params.listingId;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [listingData, setListingData] = useState(null);
  useEffect(() => {
    const listingDetails = async () => {
        try {
            setLoading(true);
            setError(false);
            axiosInstance.get(`/api/listing/get/${listingId}`, {withCredentials: true})
            .then((res) => {
                console.log(res.data);
                setListingData(res.data);
                setLoading(false);
                setError(false);
            })
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    } 
    listingDetails();
  }, [listingId]);
  return (
    <main>
        {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
        {error && <p className='text-center my-7 text-2xl'>Something went wrong!</p>}
        {listingData && !loading && !error && (
            <div>
              <Swiper navigation>
                {listingData.imageUrls.map((url) => (
                  <SwiperSlide key={url}>
                    <div className="h-[550px]" style={{background: `url(${url}) center no-repeat`, backgroundSize: 'cover'}}></div>
                  </SwiperSlide>
                ))}
              </Swiper>
            <div className="max-w-4xl mx-auto my-5 p-3 w-full">
                  <p className="text-xl font-semibold">{listingData.title} - ₹{' '} {listingData.offer ? <>
                    <span className="line-through text-slate-700">{listingData.regularPrice.toLocaleString('en-IN')} {' '}</span>
                    <span className="ml-2">{listingData.discountedPrice.toLocaleString('en-IN')}</span>
                  </> 
                     : listingData.regularPrice.toLocaleString('en-US')}{listingData.type === "rent" && '/month'}
                  </p>
                  <p className="flex text-sm text-slate-600 items-center gap-2 my-1"><FaMapMarkerAlt className="text-green-700" /> {listingData.address}</p>
                  <div className="my-4 flex gap-2">
                    <p className="bg-red-800 font-normal rounded-lg w-full flex justify-center text-white p-2">{listingData.type === "rent" ? 'For Sale' : 'For Sale'}</p>
                    {
                      listingData.discountedPrice > 1 && (
                        <p className="bg-green-800 font-normal flex rounded-lg w-full justify-center text-white p-2">₹ {+listingData.regularPrice - +listingData.discountedPrice} discount</p>
                      )
                    }
                  </div>
                  <p><span className="font-semibold">Details: </span>{listingData.description}</p>
                  <div className="flex gap-2 flex-wrap mt-4 text-green-900">
                    {listingData.bedrooms && (
                      <>
                        <p className="flex items-center">
                          <FaBed />
                          <span className="p-2">{listingData.bedrooms} Beds</span>
                        </p>
                        <p className="flex items-center">
                          <FaBath />
                          <span className="p-2">{listingData.bathrooms} Baths</span>
                        </p>
                        <p className="flex items-center">
                          <FaParking />
                          <span className="p-2">{listingData.parking ? 'Parking' : 'No Parking'} </span>
                        </p>
                        <p className="flex items-center">
                          <FaChair />
                          <span className="p-2">{listingData.furnished ? 'Furnished' : 'Not Furnished'} Beds</span>
                        </p>
                      </>
                    )}
                  </div>
            </div>
            </div>
        )}
    </main>
  )
}

export default Listing;