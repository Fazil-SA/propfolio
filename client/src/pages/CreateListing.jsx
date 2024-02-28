import { useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase.js";
import { axiosInstance } from "../instance/axios.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function CreateListing() {
  const {currentUser} = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    title: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountedPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
    userRef: currentUser._id,
  })
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  console.log(formData)
  const handleImageSubmit = (e) => {
    if(files.length > 0 && files.length + formData.imageUrls.length < 7) {
        const promises = [];
        setUploading(true);
        setImageUploadError(false);
        for(let i=0; i<files.length; i++) {
            promises.push(storeImage(files[i]));
        }

        Promise.all(promises).then((urls) => {
            setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
            setImageUploadError(false);
            setUploading(false);
        }).catch((error) => {
            setUploading(false);
            setImageUploadError('Image upload failed (2mb max per image)')
        });
    } else {
        setUploading(false);
        setImageUploadError('You can only upload 6 images per listing');
    }
  }

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress}% done`);
            },
            (error) => {
                reject(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            } 
        )
    })

}
const handleRemoveImage = (index) => {
    setFormData({
        ...formData,
        imageUrls: formData.imageUrls.filter((_,i) => i !== index),
    });
};

const handleChange = (e) => {
    // determining type sale or rent
    if(e.target.id === "sale" || e.target.id === "rent") {
        setFormData({
            ...formData,
            type: e.target.id,
        })
    }

    //checked value set
    if(e.target.id === 'parking' || e.target.id === 'offer' || e.target.id === 'furnished') {
        setFormData({
            ...formData,
            [e.target.id]: e.target.checked,
        })
    }

    //field value set
    if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        })
    }
}

const handleFormSubmit = async (e) => {
    e.preventDefault();
    if(formData.imageUrls.length < 1) return setError('You must upload at least one image');
    if(+formData.regularPrice < +formData.discountedPrice) return setError('Discount price must be lower than regular price');
    try {
        setLoading(true);
        setError(false);
        axiosInstance.post('/api/listing/create', formData, {withCredentials: true})
        .then((res) => {
            setLoading(false);
            navigate(`/listing/${res.data._id}`)
        }).catch((error) => {
            console.log(error)
            setLoading(false);
            setError(error.message);
        })
    } catch (error) {
        setError(error.message);        
    }
}

  return (
    <main className="p-3 max-w-4xl mx-auto">
        <h1 className="text-center text-3xl font-semibold my-7">Create a Listing</h1>
        <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-6">
            <div className="flex flex-col flex-1 gap-4">
                <input type="text" onChange={handleChange} className="p-3 border rounded-lg" placeholder="Title" id="title" required/>
                <textarea type="text" onChange={handleChange} className="p-3 border rounded-lg" placeholder="Description" id="description" required/>
                <input type="text" onChange={handleChange} className="p-3 border rounded-lg" placeholder="Address" id="address" required/>
                <div className="flex flex-wrap gap-4">
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={formData.type === 'sale'} className="w-5" type="checkbox" id="sale"/>
                        <span>Sell</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={formData.type === 'rent'} className="w-5" type="checkbox" id="rent"/>
                        <span>Rent</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} className="w-5" type="checkbox" id="parking"/>
                        <span>Parking Spot</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} className="w-5" type="checkbox" id="furnished"/>
                        <span>Furnished</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} className="w-5" type="checkbox" id="offer"/>
                        <span>Offer</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                        <input onChange={handleChange} className="p-3 border border-gray-300 rounded-lg" value={formData.bedrooms} type="number" id="bedrooms" min={1} max={10} required  />  
                        <span>Beds</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input onChange={handleChange} className="p-3 border border-gray-300 rounded-lg" value={formData.bathrooms} type="number" id="bathrooms" min={1} max={10} required  />  
                        <span>Baths</span>
                    </div>
                </div>
                <div className="flex flex-col flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                        <input onChange={handleChange} defaultValue={formData.regularPrice} className="p-3 border border-gray-300 rounded-lg" type="number" id="regularPrice" required  />  
                        <div className="flex flex-col items-center">
                            <span>Regular Price</span>
                            <span className="text-sm">(₹ / month)</span>
                        </div>
                    </div>
                    {formData.offer && 
                    <div className="flex items-center gap-2">
                        <input onChange={handleChange} defaultValue={formData.discountedPrice} className="p-3 border border-gray-300 rounded-lg" type="number" id="discountedPrice" required  />  
                        <div className="flex flex-col items-center">
                            <span>Discounted Price</span>
                            <span className="text-sm">(₹ / month)</span>
                        </div>
                    </div>
                    }
                </div>
            </div>
            <div className="flex flex-col flex-1">
                <div className="flex gap-2">
                    <span>Images:</span>
                    <span className="text-gray-600">The first image will be the cover (max 6)</span>
                </div>
                <div className="mt-5 flex gap-4">
                    <div className="border p-3 border-gray-300 ">
                        <input onChange={(e) => setFiles(e.target.files)} type="file" accept="image/*" multiple/>
                    </div>
                    <button type="button" onClick={handleImageSubmit} className="uppercase hover:opacity-95 text-green-600 border border-green-600 p-3 rounded-md w-full">{uploading ? "Uploading" : "Upload"}</button>
                </div>
            <p className="text-red-700 mt-3">{imageUploadError && imageUploadError}</p>
            {
                formData.imageUrls.length > 0 && formData.imageUrls.map((url ,index) => (
                    <div key={url} className="flex justify-between p-3 border items-center">
                        <img src={url} alt="listing image" className="w-20 h-20 object-contain rounded-lg" />
                        <button type="button" onClick={() => handleRemoveImage(index)} className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75">Delete</button>
                    </div>
                ))
            }
            <p className="text-red-700">{error && error}</p>
            <button disabled={loading || uploading} className="mt-5 w-full bg-slate-700 uppercase p-3 border rounded-lg text-white hover:opacity-95">{loading ? "Creating" : "Create Listing"}</button>
            </div>  

        </form>
    </main>
  )
}

export default CreateListing