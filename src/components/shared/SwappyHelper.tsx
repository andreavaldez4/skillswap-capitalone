import Image from "next/image";
import { cn } from "@/lib/utils";

type SwappyHelperProps = {
  image: "idle" | "saludo" | "estudio";
  message: string;
  className?: string;
  size?: "small" | "medium" | "large";
  variant?: "default" | "highlight" | "minimal";
  showName?: boolean;
};

export function SwappyHelper({
  image,
  message,
  className = "",
  size = "medium",
  variant = "default",
  showName = false,
}: SwappyHelperProps) {
  const imagePath = `/petimages/${image}.png`;

  // Tamaños de imagen basados en el prop size
  const imageSizes = {
    small: "w-16 h-16",
    medium: "w-24 h-24",
    large: "w-32 h-32",
  };

  const imagePixelSizes = {
    small: "64px",
    medium: "96px",
    large: "128px",
  };

  // Estilos del contenedor del mensaje según la variante
  const messageContainerStyles = {
    default: "bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 shadow-sm",
    highlight: "bg-gradient-to-r from-orange-100 to-orange-50 border-2 border-orange-300 rounded-2xl p-4 shadow-lg",
    minimal: "bg-white border border-gray-200 rounded-xl p-3",
  };

  // Estilos del texto según el tamaño
  const textSizes = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  return (
    <div className={cn("flex items-start gap-4 group", className)}>
      {/* Imagen de Swappy con animación */}
      <div
        className={cn(
          "relative shrink-0 transition-transform duration-300 group-hover:scale-110",
          imageSizes[size]
        )}
      >
        <Image
          src={imagePath}
          alt="Swappy - Tu asistente de SkillSwap"
          fill
          sizes={imagePixelSizes[size]}
          className="object-contain drop-shadow-md"
          priority
        />
      </div>

      {/* Mensaje con estilo mejorado */}
      <div className="flex-1 flex flex-col gap-2">
        {showName && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wide">
              Swappy
            </span>
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
          </div>
        )}
        <div
          className={cn(
            messageContainerStyles[variant],
            "transition-shadow duration-300 group-hover:shadow-md"
          )}
        >
          <p className={cn("text-gray-800 leading-relaxed", textSizes[size])}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
