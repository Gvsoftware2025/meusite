"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, Expand, Pause, Play } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProjectImageSliderProps {
  images: string[]
  title: string
  autoPlay?: boolean
  autoPlayInterval?: number
  className?: string
}

export function ProjectImageSlider({
  images,
  title,
  autoPlay = true,
  autoPlayInterval = 4000,
  className,
}: ProjectImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Garantir que temos pelo menos uma imagem
  const imageList = images && images.length > 0 ? images : ["/placeholder.svg"]
  const hasMultipleImages = imageList.length > 1

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % imageList.length)
  }, [imageList.length])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length)
  }, [imageList.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Autoplay
  useEffect(() => {
    if (!isPlaying || !hasMultipleImages || isHovered) return

    const interval = setInterval(goToNext, autoPlayInterval)
    return () => clearInterval(interval)
  }, [isPlaying, hasMultipleImages, isHovered, goToNext, autoPlayInterval])

  // Keyboard navigation
  useEffect(() => {
    if (!isFullscreen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrev()
      if (e.key === "ArrowRight") goToNext()
      if (e.key === "Escape") setIsFullscreen(false)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isFullscreen, goToPrev, goToNext])

  return (
    <>
      {/* Main Slider */}
      <div
        className={cn("relative group overflow-hidden rounded-xl", className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Images */}
        <div className="relative aspect-video overflow-hidden bg-black/20">
          {imageList.map((image, index) => (
            <div
              key={index}
              className={cn(
                "absolute inset-0 transition-all duration-700 ease-out",
                index === currentIndex
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105"
              )}
            >
              <Image
                src={image}
                alt={`${title} - Imagem ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={index === 0}
              />
            </div>
          ))}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Navigation Arrows */}
        {hasMultipleImages && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToPrev()
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-black/70 hover:scale-110 transition-all duration-300"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-black/70 hover:scale-110 transition-all duration-300"
              aria-label="Proxima imagem"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Dots */}
          {hasMultipleImages && (
            <div className="flex items-center gap-2">
              {imageList.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    goToSlide(index)
                  }}
                  className={cn(
                    "transition-all duration-300",
                    index === currentIndex
                      ? "w-6 h-2 rounded-full bg-white"
                      : "w-2 h-2 rounded-full bg-white/50 hover:bg-white/80"
                  )}
                  aria-label={`Ir para imagem ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2 ml-auto">
            {hasMultipleImages && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsPlaying(!isPlaying)
                }}
                className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/70 transition-all"
                aria-label={isPlaying ? "Pausar" : "Reproduzir"}
              >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsFullscreen(true)
              }}
              className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/70 transition-all"
              aria-label="Tela cheia"
            >
              <Expand className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Image counter */}
        {hasMultipleImages && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            {currentIndex + 1} / {imageList.length}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center"
          onClick={() => setIsFullscreen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image */}
          <div
            className="relative w-full h-full max-w-6xl max-h-[85vh] mx-auto p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={imageList[currentIndex]}
              alt={`${title} - Imagem ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Fullscreen Navigation */}
          {hasMultipleImages && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToPrev()
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all"
                aria-label="Imagem anterior"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToNext()
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all"
                aria-label="Proxima imagem"
              >
                <ChevronRight className="w-7 h-7" />
              </button>

              {/* Fullscreen Dots */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
                {imageList.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation()
                      goToSlide(index)
                    }}
                    className={cn(
                      "transition-all duration-300",
                      index === currentIndex
                        ? "w-8 h-2 rounded-full bg-white"
                        : "w-2 h-2 rounded-full bg-white/40 hover:bg-white/70"
                    )}
                    aria-label={`Ir para imagem ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Image info */}
          <div className="absolute bottom-8 left-8 text-white">
            <p className="text-lg font-medium">{title}</p>
            <p className="text-sm text-white/60">
              {currentIndex + 1} de {imageList.length}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
