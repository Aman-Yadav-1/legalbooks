'use client'
import { useRouter } from 'next/navigation';

export default function Hero() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/registration');
  };

  return (
    <div className="bg-white text-black mx-auto p-6">
      <div className="mt-10 mb-8 flex flex-col justify-center space-y-6 items-center mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl text-center">
        <h1 className="md:text-5xl sm:text-4xl text-3xl font-extrabold leading-tight">
          India&apos;s Largest Legal Platform
        </h1>
        <p className="text-sm md:text-sm max-w-lg">
          Connecting you with top legal experts across the country. Whether you need a lawyer for personal or professional matters, we&apos;ve got you covered.
        </p>
        <button 
          onClick={handleGetStarted}
          className="bg-[#1f2937] hover:bg-white hover:text-black hover:border hover:border-black rounded-md text-white px-4 py-2 font-semibold text-md shadow-xl transition-transform duration-300 transform hover:scale-105"
        >
          Get Started Now
        </button>
        <p className="text-sm mt-1">
          &quot;Empowering you with legal knowledge and expert advice.&quot;
        </p>
        <p className="text-gray-400 text-xs mt-2">
          Legal Tech Product 2024 - Your Trusted Legal Partner
        </p>
      </div>
    </div>
  );
}