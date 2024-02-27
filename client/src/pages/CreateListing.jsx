
function CreateListing() {
  return (
    <main className="p-3 max-w-4xl mx-auto">
        <h1 className="text-center text-3xl font-semibold my-7">Create a Listing</h1>
        <form className="flex flex-col sm:flex-row gap-6">
            <div className="flex flex-col flex-1 gap-4">
                <input type="text" className="p-3 border rounded-lg" placeholder="Name" id="name" />
                <textarea type="text" className="p-3 border rounded-lg" placeholder="Description" id="description" />
                <input type="text" className="p-3 border rounded-lg" placeholder="Address" id="address" />
                <div className="flex flex-wrap gap-4">
                    <div className="flex gap-2">
                        <input className="w-5" type="checkbox" />
                        <span>Sell</span>
                    </div>
                    <div className="flex gap-2">
                        <input className="w-5" type="checkbox" />
                        <span>Rent</span>
                    </div>
                    <div className="flex gap-2">
                        <input className="w-5" type="checkbox" />
                        <span>Parking Spot</span>
                    </div>
                    <div className="flex gap-2">
                        <input className="w-5" type="checkbox" />
                        <span>Furnished</span>
                    </div>
                    <div className="flex gap-2">
                        <input className="w-5" type="checkbox" />
                        <span>Offer</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                        <input className="p-3 border border-gray-300 rounded-lg" defaultValue={2} type="number" id="bedrooms" min={1} max={10} required  />  
                        <span>Beds</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input className="p-3 border border-gray-300 rounded-lg" defaultValue={1} type="number" id="bathrooms" min={1} max={10} required  />  
                        <span>Baths</span>
                    </div>
                </div>
                <div className="flex flex-col flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                        <input className="p-3 border border-gray-300 rounded-lg" defaultValue={0} type="number" id="regularprice" required  />  
                        <div className="flex flex-col items-center">
                            <span>Regular Price</span>
                            <span className="text-sm">(₹ / month)</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input className="p-3 border border-gray-300 rounded-lg" defaultValue={0} type="number" id="discounted" required  />  
                        <div className="flex flex-col items-center">
                            <span>Discounted Price</span>
                            <span className="text-sm">(₹ / month)</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-1">
                <div className="flex gap-2">
                    <span>Images:</span>
                    <span className="text-gray-600">The first image will be the cover (max 6)</span>
                </div>
                <div className="mt-5 flex gap-4">
                    <div className="border p-3 border-gray-300 ">
                        <input type="file" accept="images/*" multiple/>
                    </div>
                    <button className="uppercase text-green-600 border border-green-600 p-3 rounded-md w-full">Upload</button>
                </div>
            <button className="mt-5 w-full bg-slate-700 uppercase p-3 border rounded-lg text-white">Create Listing</button>
            </div>
        </form>
    </main>
  )
}

export default CreateListing