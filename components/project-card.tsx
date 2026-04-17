"use client"

import { useState } from "react"
import { ExternalLink, Github, Star, X } from "lucide-react"
import { ProjectImageSlider } from "./project-image-slider"
import { cn } from "@/lib/utils"

interface Project {
  id: string
  title: string
  description: string
  image_url?: string
  images?: string[]
  project_url?: string
  github_url?: string
  technologies?: string[]
  is_featured?: boolean
  show_link?: boolean
}

interface ProjectCardProps {
  project: Project
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Parse images - pode ser JSON string ou array
  const getImages = (): string[] => {
    if (project.images) {
      if (typeof project.images === "string") {
        try {
          return JSON.parse(project.images)
        } catch {
          return [project.images]
        }
      }
      if (Array.isArray(project.images)) {
        return project.images
      }
    }
    if (project.image_url) {
      return [project.image_url]
    }
    return []
  }

  const images = getImages()
  const technologies = project.technologies || []

  const delays = ["delay-100", "delay-200", "delay-300", "delay-400"]

  return (
    <>
      <div
        className={cn(
          "group relative glass-card rounded-2xl overflow-hidden hover-lift cursor-pointer scroll-reveal zoom-in",
          delays[index % 4]
        )}
        onClick={() => setIsModalOpen(true)}
      >
        {/* Featured badge */}
        {project.is_featured && (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/90 to-orange-500/90 backdrop-blur-sm text-white text-xs font-semibold shadow-lg">
            <Star className="w-3 h-3 fill-current" />
            Destaque
          </div>
        )}

        {/* Image Slider */}
        <ProjectImageSlider
          images={images}
          title={project.title}
          autoPlay={true}
          autoPlayInterval={3000}
        />

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2 mb-4">
            {project.description}
          </p>

          {/* Technologies */}
          {technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {technologies.slice(0, 4).map((tech, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
              {technologies.length > 4 && (
                <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs">
                  +{technologies.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Links */}
          <div className="flex items-center gap-3">
            {project.show_link && project.project_url && (
              <a
                href={project.project_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                Ver Projeto
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-all"
              >
                <Github className="w-4 h-4" />
                Codigo
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Project Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-white/10 rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/70 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Slider - sem autoplay no modal */}
            <ProjectImageSlider
              images={images}
              title={project.title}
              autoPlay={false}
              className="rounded-t-3xl"
            />

            {/* Content */}
            <div className="p-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h2 className="text-3xl font-bold text-white">{project.title}</h2>
                {project.is_featured && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold">
                    <Star className="w-3 h-3 fill-current" />
                    Destaque
                  </div>
                )}
              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {project.description}
              </p>

              {/* Technologies */}
              {technologies.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Tecnologias
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                {project.show_link && project.project_url && (
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Ver Projeto Online
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
                  >
                    <Github className="w-5 h-5" />
                    Ver Codigo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
