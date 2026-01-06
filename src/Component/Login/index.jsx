import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  
 

  const handleSubmit = (e) => {
  e.preventDefault();

  if (!email || !password) {
    toast.error("Email and Password are required");
    return;
  }

  if (email !== "admin@gmail.com" || password !== "123456") {
    toast.error("Invalid email or password");
    return;
  }

  localStorage.setItem("isAuth", "true");

  toast.success("Login successful");

  navigate("/dashboard");
};



   useEffect(()=>{
    const isAuthenticated = localStorage.getItem("isAuth");
    if(isAuthenticated){
        navigate("/dashboard")
    }
  },[])



  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE (Brand / Image) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 items-center justify-center text-white p-10">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-4">
            Welcome <span className="text-white">BOOKXPERT</span> 👋
          </h1>
          <p className="text-lg text-blue-100">
            Login to manage your dashboard, track data, and access all features.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE (FORM) */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Sign In
          </h2>
          <p className="text-gray-500 mb-6">
            Enter your credentials to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Sign In
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
