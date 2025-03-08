import React from "react";

const Login = () => {
  return (
    <div className="h-screen w-full overflow-hidden bg-cover bg-center flex items-center justify-center relative" 
         style={{ backgroundImage: "url('https://cdn.vectorstock.com/i/1000v/79/88/taxi-car-front-view-in-dark-background-vector-43697988.avif')" }}>
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Glass-morphism login container */}
      <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-96 shadow-2xl transition-all hover:shadow-3xl">
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
          Welcome Back
        </h2>

        <form className="space-y-6">
          {/* Email Input with floating label effect */}
          <div className="group relative">
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-transparent 
                       peer focus:outline-none focus:border-red-400 transition-colors"
              placeholder="Email"
            />
            <label 
              htmlFor="email"
              className="absolute left-4 -top-2.5 px-1 text-white/80 text-sm transition-all
                         peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5
                         peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-red-300 bg-transparent"
            >
              Email
            </label>
          </div>

          {/* Password Input with floating label */}
          <div className="group relative">
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-transparent 
                       peer focus:outline-none focus:border-red-400 transition-colors"
              placeholder="Password"
            />
            <label 
              htmlFor="password"
              className="absolute left-4 -top-2.5 px-1 text-white/80 text-sm transition-all
                         peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5
                         peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-red-300 bg-transparent"
            >
              Password
            </label>
          </div>

          {/* Animated Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-red-500 to-red-600 rounded-lg text-white font-semibold
                      transform transition-all hover:scale-[1.02] hover:from-red-600 hover:to-red-700
                      active:scale-95 shadow-lg hover:shadow-red-500/20"
          >
            Sign In
          </button>
        </form>

        {/* Additional Links */}
        <div className="mt-6 flex justify-center text-sm">
          <a href="/forgetpassword" className="text-white/70 hover:text-red-300 transition-colors">
            Forgot Password?
          </a>
          <span className="text-white mx-2 opacity-50">|</span>
          <a href="/ridersignup" className="text-white/70 hover:text-red-300 transition-colors">
            Create Account
          </a>
        </div>

        {/* Social Login Divider */}
        {/* <div className="relative mt-8"> */}
          {/* <div className="absolute inset-0 flex items-center"> */}
            {/* <div className="w-full border-t border-white/20"></div> */}
          {/* </div> */}
          {/* <div className="relative flex justify-center text-sm"> */}
            {/* <span className="px-2 bg-transparent text-white/50">Or continue with</span> */}
          {/* </div> */}
        {/* </div> */}

        {/* Social Login Buttons */}
        {/*<div className="mt-6 grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 
                           border border-white/10 rounded-lg text-white transition-all">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              {/* Google SVG icon */}
            {/*</svg>
            Google
          </button>
          <button className="flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 
                           border border-white/10 rounded-lg text-white transition-all">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              {/* GitHub SVG icon */}
            {/*</svg>
            GitHub
          </button>
        </div>*/}
      </div>
    </div>
  );
};

export default Login;