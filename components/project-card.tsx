"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Briefcase } from "lucide-react"

interface ProjectCardProps {
  project: {
    id: string
    title: string
    description: string
    image_url: string | string[] | any
    technologies?: string[]
    is_featured?: boolean
    display_order?: number
    project_url?: string
    github_url?: string
  }
  onClick: () => void
  animationClass?: string
  delayClass?: string
}

export function ProjectCard({ project, onClick, animationClass = "", delayClass = "" }: ProjectCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageError, setImageError] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const technologies = project.technologies || []
  const description = project.description || "Sem descrição"
  const title = project.title || "Projeto Sem Título"

  const getImages = () => {
    try {
      const imageData = project.image_url

      if (Array.isArray(imageData)) {
        return imageData.filter((img) => img && typeof img === "string" && img.length > 0)
      }

      if (typeof imageData === "string" && imageData.length > 0) {
        return [imageData]
      }

      return []
    } catch (error) {
      console.error("Error getting images:", error)
      return []
    }
  }

  const images = getImages()
  const hasImages = images.length > 0

  useEffect(() => {
    if (images.length <= 1 || isPaused || imageError) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 4000) // Change image every 4 seconds

    return () => clearInterval(interval)
  }, [images.length, isPaused, imageError])

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`relative bg-gradient-to-b from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:scale-[1.03] hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 group cursor-pointer ${animationClass} ${delayClass}`}
    >
      {/* Image section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-purple-600/20 to-blue-600/20">
        {hasImages && !imageError ? (
          <div className="relative w-full h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[currentImageIndex] || "/placeholder.svg"}
              alt={`${title} - Imagem ${currentImageIndex + 1}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
            <div className="text-center p-2">
              <Briefcase className="w-8 h-8 mx-auto mb-1 opacity-50" />
              <span className="text-xs">Sem imagem</span>
            </div>
          </div>
        )}

        {/* Navigation arrows - only show if multiple images */}
        {images.length > 1 && !imageError && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Image indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all ${
                    index === currentImageIndex ? "bg-white w-4" : "bg-white/50 w-1"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content section */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-white mb-1.5 line-clamp-1">{title}</h3>
        <p className="text-gray-400 mb-3 line-clamp-2 text-xs leading-relaxed">{description}</p>

        {/* Technologies tags */}
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {technologies.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-[10px] rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30"
              >
                {tag}
              </span>
            ))}
            {technologies.length > 3 && (
              <span className="px-2 py-0.5 text-[10px] rounded-full bg-gray-500/20 text-gray-400">
                +{technologies.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
