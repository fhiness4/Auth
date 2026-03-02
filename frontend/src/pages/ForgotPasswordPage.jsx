import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import Input from "../components/Input";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState("");
	const [err, seterr] = useState("");
  const url = 'https://auth-backend-woad.vercel.app/api/auth'
	const [isLoading, setisloading] = useState(false);
	const navigate = useNavigate();
   
	const handleSubmit = async (e) => {
		e.preventDefault();
		setisloading(true)

	try {
			const response = await fetch(`${url}/send-forgot-code`, {
            method: "PATCH",
            mode: "cors",
            headers:{
                "content-Type": "application/json"
            },
            body:JSON.stringify({
                email: email
            })
          });
          const res = await response.json();
            console.log(res);
		  	if(res.success){
				setisloading(false);
				seterr(res.message);
                setTimeout(() => {
					navigate('/reset-password', {state:{data:res.user.email}})
				}, 1000);
				return;
			}
			else{
				seterr(res.message);
				setisloading(false);
				return;
			}
		} catch (error) {
			console.log(error);
		}

	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
		>
			<div className='p-8'>
				<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
					Forgot Password
				</h2>
					<form onSubmit={handleSubmit}>
						<p className='text-gray-300 mb-6 text-center'>
							Enter your email address and we'll send you a link to reset your password.
						</p>
						<Input
							icon={Mail}
							type='email'
							placeholder='Email Address'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
							{err && <p className={isLoading ? "text-green-500" : "text-red-500"}>{err}</p>}
							<br />
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
							type='submit'
						>
							{isLoading ? <Loader className='size-6 animate-spin mx-auto' /> : "Reset password"}
						</motion.button>
					</form>
				
			</div>

			<div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
				<Link to={"/login"} className='text-sm text-green-400 hover:underline flex items-center'>
					<ArrowLeft className='h-4 w-4 mr-2' /> Back to Login
				</Link>
			</div>
		</motion.div>
	);
};
export default ForgotPasswordPage;
