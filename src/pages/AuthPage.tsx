import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const signupImage = '/Global/SignupImage.png'
const loginImage = '/Global/SignupImage.png'

const AuthPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const isLogin = location.pathname === '/login'

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  const [remember, setRemember] = useState(false)
  const [agree, setAgree] = useState(false)
  const [animating, setAnimating] = useState(false)

  const switchTo = (path: '/login' | '/signup') => {
    if (animating) return

    setAnimating(true)

    setTimeout(() => {
      navigate(path)
      setAnimating(false)
    }, 400)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  useEffect(() => {
    // Reset form when switching between login/signup
    return () => {
      setForm({
        name: '',
        email: '',
        password: '',
      })
    }
  }, [isLogin])

  const FormPanel = (
    <div className="w-full max-w-[480px] flex flex-col justify-center py-8 sm:py-10">
      {/* Tabs */}
      <div className="flex mb-8 border-b border-gray-300 w-full">
        <button
          onClick={() => switchTo('/signup')}
          className={`flex-1 pb-3 text-sm font-medium transition-all border-b-2 -mb-px text-center ${
            !isLogin
              ? 'text-[#006384] border-[#006384]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Sign up
        </button>

        <button
          onClick={() => switchTo('/login')}
          className={`flex-1 pb-3 text-sm font-medium transition-all border-b-2 -mb-px text-center ${
            isLogin
              ? 'text-[#006384] border-[#006384]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Log in
        </button>
      </div>

      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
        {isLogin ? 'Welcome back!' : 'Get Started Now'}
      </h2>

      {isLogin ? (
        <p className="text-sm text-gray-500 mb-6">
          Enter your credentials to access your account
        </p>
      ) : (
        <div className="mb-6" />
      )}

      {/* Fields */}
      <div className="flex flex-col gap-4">
        {!isLogin && (
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Name
            </label>

            <input
              name="name"
              placeholder="Your full name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-transparent rounded-md px-4 py-3 text-sm outline-none focus:border-[#006384] transition placeholder-gray-300"
            />
          </div>
        )}

        <div>
          <label className="text-xs text-gray-500 mb-1 block">
            Email address / Mobile no
          </label>

          <input
            name="email"
            placeholder="Your email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 bg-transparent rounded-md px-4 py-3 text-sm outline-none focus:border-[#006384] transition placeholder-gray-300"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs text-gray-500">
              Password / OTP
            </label>

            {isLogin && (
              <button className="text-xs text-[#006384] hover:underline">
                Forgot password
              </button>
            )}
          </div>

          <input
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 bg-transparent rounded-md px-4 py-3 text-sm outline-none focus:border-[#006384] transition placeholder-gray-300"
          />
        </div>
      </div>

      {/* Checkbox */}
      <div className="mt-4 flex items-center gap-2">
        <input
          type="checkbox"
          id="check"
          checked={isLogin ? remember : agree}
          onChange={(e) =>
            isLogin
              ? setRemember(e.target.checked)
              : setAgree(e.target.checked)
          }
          className="accent-[#006384]"
        />

        <label
          htmlFor="check"
          className="text-xs sm:text-sm text-gray-500"
        >
          {isLogin
            ? 'Remember for 30 days'
            : 'I agree to the terms & policy'}
        </label>
      </div>

      {/* Submit */}
      <button
        className="mt-5 w-full text-white text-sm font-semibold py-3 rounded-md transition hover:opacity-90 active:scale-[0.99]"
        style={{ backgroundColor: '#006384' }}
      >
        {isLogin ? 'Login' : 'Signup'}
      </button>

      {/* Social */}
      {!isLogin && (
        <>
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-300" />

            <span className="text-xs text-gray-400">or</span>

            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-md py-3 text-xs text-gray-600 hover:bg-white/50 transition">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-4 h-4"
                alt=""
              />

              Sign in with Google
            </button>

            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-md py-3 text-xs text-gray-600 hover:bg-white/50 transition">
              <img
                src="/Global/appleIcon.png"
                className="w-4 h-4"
                alt=""
              />

              Sign in with Apple
            </button>
          </div>
        </>
      )}

      {/* Bottom */}
      <p className="mt-6 text-xs sm:text-sm text-center text-gray-500">
        {isLogin ? (
          <>
            Don't have an account?{' '}
            <button
              onClick={() => switchTo('/signup')}
              className="text-[#006384] hover:underline font-medium"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Have an account?{' '}
            <button
              onClick={() => switchTo('/login')}
              className="text-[#006384] hover:underline font-medium"
            >
              Log in
            </button>
          </>
        )}
      </p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f3f4f6] overflow-hidden">
      <div
        className={`
          w-full min-h-screen flex
          flex-col lg:flex-row
        `}
        style={{
          opacity: animating ? 0 : 1,
          transform: animating
            ? isLogin
              ? 'translateX(30px)'
              : 'translateX(-30px)'
            : 'translateX(0)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}
      >
        {!isLogin ? (
          <>
            {/* FORM */}
            <div
              className="
                w-full lg:w-[48%]
                flex items-center justify-center
                px-6 sm:px-10 md:px-16 lg:px-20
                py-10 lg:py-0
              "
            >
              {FormPanel}
            </div>

            {/* IMAGE - ONLY LARGE SCREENS */}
            <div className="hidden lg:block lg:w-[52%] h-screen">
              <img
                src={signupImage}
                alt=""
                className="w-full h-full object-cover rounded-l-[32px]"
              />
            </div>
          </>
        ) : (
          <>
            {/* IMAGE - ONLY LARGE SCREENS */}
            <div className="hidden lg:block lg:w-[52%] h-screen">
              <img
                src={loginImage}
                alt=""
                className="w-full h-full object-cover rounded-r-[32px]"
              />
            </div>

            {/* FORM */}
            <div
              className="
                w-full lg:w-[48%]
                flex items-center justify-center
                px-6 sm:px-10 md:px-16 lg:px-20
                py-10 lg:py-0
              "
            >
              {FormPanel}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AuthPage