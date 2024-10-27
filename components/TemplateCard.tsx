import { FaFileAlt } from 'react-icons/fa';

function TemplateCard({ text }: { text: string }) {
  return (
    <div className="flex flex-col justify-center shadow-md hover:scale-95 items-center mb-4 bg-white p-4 border rounded-lg">
      <FaFileAlt className="w-12 h-12 mb-2 text-black" />
      <p className="text-lg">{text}</p>
    </div>
  );
}

export default TemplateCard;