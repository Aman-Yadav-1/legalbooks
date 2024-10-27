import Image from 'next/image';

function ForlawCards({ img, name }: { img: string; name: string }) {
  return (
    <div className="group relative flex flex-col items-center p-4 bg-white rounded-lg shadow-xl transition-transform transform hover:scale-105 hover:shadow-2xl hover:bg-[#1e3a8a] duration-300 cursor-pointer">
      <div className="mb-4">
        <Image src={`${img}`} alt={name} width={30} height={30} className="" />
      </div>
      <div className="text-lg font-medium text-black group-hover:text-white text-center cursor-pointer">
        {name}
      </div>
    </div>
  );
}

export default ForlawCards;
