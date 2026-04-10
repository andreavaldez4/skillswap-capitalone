import Image from 'next/image';

type SwappyHelperProps = {
  image: 'idle' | 'saludo' | 'estudio';
  message: string;
  className?: string;
};

export function SwappyHelper({
  image,
  message,
  className = '',
}: SwappyHelperProps) {
  const imagePath = `/petImages/${image}.png`;

  return (
    <div className={`flex items-start gap-4 ${className}`}>
      <div className="relative w-16 h-16 flex-shrink-0">
        <Image
          src={imagePath}
          alt="Swappy"
          fill
          className="object-contain"
        />
      </div>
      <div className="bg-orange-50 rounded-lg p-3 flex-1">
        <p className="text-sm text-gray-700">{message}</p>
      </div>
    </div>
  );
}
