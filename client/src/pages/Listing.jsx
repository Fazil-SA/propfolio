import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { axiosInstance } from "../instance/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

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
            </div>
        )}
    </main>
  )
}

export default Listing;