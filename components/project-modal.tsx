"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Github, Play } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ProjectModalProps {
  project: {
    id: string
    title: string
    description: string
    image_url: string | string[]
    technologies: string[]
    project_url?: string
    github_url?: string
  }
  isOpen: boolean
  onClose: () => void
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageError, setImageError] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const getImages = () => {
    let imageData = project.image_url

    // If it's a string that looks like JSON, parse it
    if (typeof imageData === "string" && imageData.trim().startsWith("[")) {
      try {
        imageData = JSON.parse(imageData)
      } catch (e) {
        console.error("Failed to parse image_url:", e)
      }
    }

    // Convert to array if it's a string
    return Array.isArray(imageData) ? imageData : [imageData]
  }

  const images = getImages().filter((img) => img !== null && img !== undefined && img !== "")

  useEffect(() => {
    if (images.length <= 1 || isPaused || imageError) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 4000) // Change image every 4 seconds

    return () => clearInterval(interval)
  }, [images.length, isPaused, imageError])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const currentImage = images[currentImageIndex]
  const isBase64 = currentImage && currentImage.startsWith("data:image")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gray-900/95 border-purple-500/20 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {project.title}
          </DialogTitle>
        </DialogHeader>

        {/* Image Slider */}
        <div
          className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-purple-600/20 to-blue-600/20"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {images.length > 0 && currentImage && !imageError ? (
            isBase64 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentImage || "/placeholder.svg"}
                alt={`${project.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <Image
                src={currentImage || "/placeholder.svg"}
                alt={`${project.title} - Image ${currentImageIndex + 1}`}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span>Imagem não disponível</span>
            </div>
          )}

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex ? "bg-white w-8" : "bg-white/50"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Project Details */}
        <div className="space-y-4 mt-4">
          <div>
            <h3 className="text-lg font-semibold text-purple-300 mb-2">Descrição</h3>
            <p className="text-gray-300 leading-relaxed">{project.description}</p>
          </div>

          {project.technologies && project.technologies.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-purple-300 mb-2">Tecnologias</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Project Links */}
          <div className="flex flex-wrap gap-3 pt-4">
            {project.project_url && (
              <a
                href={project.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all hover:scale-105 shadow-lg hover:shadow-purple-500/50 font-medium"
              >
                <Play className="w-4 h-4" />
                Ver Demonstração
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all hover:scale-105 shadow-lg font-medium"
              >
                <Github className="w-4 h-4" />
                Ver Código
              </a>
            )}
            {!project.project_url && !project.github_url && (
              <p className="text-gray-500 text-sm italic">Links não disponíveis para este projeto</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
