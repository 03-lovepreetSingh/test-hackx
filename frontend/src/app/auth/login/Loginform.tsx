import React from 'react'
import  SocialLoginButton  from './SocialLoginButton'
import  WalletLoginButton  from './WalletLoginButton'
export default function LoginForm() {
  return (
    <div className="w-full max-w-md flex flex-col items-center">
      {/* Logo */}
      <div className="mb-8">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"
            fill="#0092ff"
          />
        </svg>
      </div>
      {/* Welcome Text */}
      <h1 className="text-2xl font-bold text-white mb-3">Welcome!</h1>
      {/* Description Text */}
      <p className="text-[#949fa8] text-center mb-8 text-sm">
        Hack X is a place to take part in a hackathon, create and manage one or
        to judge one. Become a part of HackX community
      </p>
      {/* Email Input */}
      <div className="w-full mb-6">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded bg-[#0f1011] border border-[#242425] text-white focus:outline-none focus:border-[#0092ff]"
        />
      </div>
      {/* Social Login Buttons */}
      <div className="flex space-x-3 mb-6 w-full">
        <SocialLoginButton provider="google" />
        <SocialLoginButton provider="apple" />
        <SocialLoginButton provider="x" />
        <SocialLoginButton provider="discord" />
      </div>
      {/* Divider */}
      <div className="flex items-center w-full mb-6">
        <div className="flex-grow h-px bg-[#242425]"></div>
        <span className="px-4 text-sm text-[#949fa8]">or</span>
        <div className="flex-grow h-px bg-[#242425]"></div>
      </div>
      {/* Wallet Login Buttons */}
      <div className="w-full space-y-3 mb-8">
        <WalletLoginButton provider="metamask" />
        <WalletLoginButton provider="walletconnect" />
        <WalletLoginButton provider="coinbase" />
        <WalletLoginButton provider="metamask" />
      </div>
      {/* Footer Links */}
      <div className="flex justify-between w-full text-xs text-[#949fa8]">
        <a href="#" className="hover:text-[#0092ff]">
          Privacy Policy
        </a>
        <a href="#" className="hover:text-[#0092ff]">
          Terms of use
        </a>
        <a href="https://x.com" className="hover:text-[#0092ff]">
          x.com
        </a>
      </div>
    </div>
  )
}
