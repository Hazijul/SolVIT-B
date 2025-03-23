import { Navbar } from "../Navbar"
import { useState } from 'react';
import { doc, setDoc } from '@firebase/firestore';
import { createUserWithEmailAndPassword, signInWithPopup } from '@firebase/auth';
import { auth, googleProvider, db } from '../../firebase/config';
export const Hospital = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    mobile: '',
    password: '',
    email: '',
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeCnf = (e) => {
    const { value } = e.target;
    setPassCnf(value);
  }

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, address, name, mobile, password } = formData;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let userData = {
        uid: user.uid,
        name,
        address,
        email,
        mobile
      };

      console.log("kajshgfalskjdf")

      let collectionName = 'hospitals';

      await setDoc(doc(db, collectionName, user.uid), userData);

      console.log(`Hospital signed up:`, user);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };


  const [cnfPass, setPassCnf] = useState('')
  return (
    <>
      <div className="">

        <Navbar />
      </div>
      <div className="mt-20">

        <h1 className="text-5xl text-center  ">Hospital Registration Portal</h1>
        <div className="max-w-4xl max-sm:max-w-lg mx-auto p-6 mt-6">
          <div className="text-center mb-12 sm:mb-16">

            <h4 className="font-bold text-xl text-base  text-black mt-6">Sign up into your account</h4>
          </div>

          <form>
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <label className="text-slate-800 text-sm font-medium mb-2 block">Hospital's Name</label>
                <input name="name" type="text" value={formData.name} onChange={handleChange} className="bg-slate-100 w-full text-slate-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all" placeholder="Enter name" />
              </div>
              {/* Error Message */}
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <div>
                <label className="text-slate-800 text-sm font-medium mb-2 block">Address</label>
                <input name="address" type="text" value={formData.address} onChange={handleChange} className="bg-slate-100 w-full text-slate-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all" placeholder="Enter last name" />
              </div>
              <div>
                <label className="text-slate-800 text-sm font-medium mb-2 block">Email Id</label>
                <input name="email" type="text" value={formData.email} onChange={handleChange} className="bg-slate-100 w-full text-slate-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all" placeholder="Enter email" />
              </div>
              <div>
                <label className="text-slate-800 text-sm font-medium mb-2 block">Mobile No.</label>
                <input name="mobile" type="number" value={formData.mobile} onChange={handleChange} className="bg-slate-100 w-full text-slate-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all" placeholder="Enter mobile number" />
              </div>
              <div>
                <label className="text-slate-800 text-sm font-medium mb-2 block">Password</label>
                <input name="password" type="password" value={formData.password} onChange={handleChange} className="bg-slate-100 w-full text-slate-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all" placeholder="Enter password" />
              </div>
              <div>
                <label className="text-slate-800 text-sm font-medium mb-2 block">Confirm Password</label>
                <input name="cpassword" type="password" value={cnfPass} onChange={handleChangeCnf} className="bg-slate-100 w-full text-slate-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all" placeholder="Enter confirm password" />
              </div>
            </div>

            <div className="mt-12">
              <button
                onClick={handleSubmit}
                type="button" className="mx-auto block py-3 px-6 text-sm font-medium tracking-wider rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}