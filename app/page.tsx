"use client"

import type React from "react"
import Image from "next/image"
import { SocialFloat } from "@/components/social-float"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Code2,
  Smartphone,
  Database,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  MessageCircle,
  Zap,
  Folder,
  Mail,
  Phone,
  Instagram,
  Briefcase,
  Server,
  FileCode,
  Terminal,
  Leaf,
  Box,
  Cloud,
  GitBranch,
  Palette,
  Share2,
  type LucideIcon,
} from "lucide-react"
import { useState, useEffect } from "react"

const iconMap: Record<string, LucideIcon> = {
  Code2,
  Zap,
  Server,
  FileCode,
  Terminal,
  Database,
  Leaf,
  Container: Box,
  Cloud,
  GitBranch,
  Palette,
  Share2,
  Smartphone,
  Sparkles,
}

// Interface for projects from database
interface Project {
  id: string
  title: string
  description: string
  image_url?: string
  images?: string[] | string
  project_url?: string
  github_url?: string
  technologies?: string[]
  is_featured?: boolean
  show_link?: boolean
  display_order?: number
}

interface Skill {
  id: string
  name: string
  icon: string
  color: string
  category: string
  display_order: number
}

interface AboutData {
  description: string
  projects_count: number
  clients_count: number
  years_experience: number
}

export default function PortfolioPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  // State for projects from database
  const [projects, setProjects] = useState<Project[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    subject: "",
    budget: "",
    deadline: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [aboutData, setAboutData] = useState<AboutData>({
    description:
      "Somos especializados em criar experiências digitais inovadoras e soluções tecnológicas que transformam negócios.",
    projects_count: 50,
    clients_count: 100,
    years_experience: 5,
  })
  const [loadingAbout, setLoadingAbout] = useState(true)
  const [skills, setSkills] = useState<Skill[]>([])
  const [loadingSkills, setLoadingSkills] = useState(true)

  // Fetch all portfolio data from API (PostgreSQL)
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const response = await fetch("/api/portfolio")
        
        if (response.ok) {
          const data = await response.json()
          
          if (data.about) {
            setAboutData({
              description: data.about.description || aboutData.description,
              projects_count: data.about.projects_count || 50,
              clients_count: data.about.clients_count || 100,
              years_experience: data.about.years_experience || 5,
            })
          }
          
          if (data.skills && data.skills.length > 0) {
            setSkills(data.skills)
          }
          
          if (data.projects) {
            setProjects(data.projects)
          }
        }
      } catch (error) {
        console.error("[v0] Error fetching portfolio data:", error)
      } finally {
        setLoadingProjects(false)
        setLoadingAbout(false)
        setLoadingSkills(false)
      }
    }

    fetchPortfolioData()
  }, [])

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed")
        } else {
          entry.target.classList.remove("revealed")
        }
      })
    }, observerOptions)

    // Small delay to ensure DOM is updated after state changes
    const timeoutId = setTimeout(() => {
      const elements = document.querySelectorAll(".scroll-reveal")
      elements.forEach((el) => observer.observe(el))
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
    }
  }, [skills, projects, loadingSkills, loadingProjects])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Salvar no PostgreSQL da VPS
      const response = await fetch("/api/portfolio/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      // Tambem enviar email via API de contato existente
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formData.name,
          empresa: formData.company,
          email: formData.email,
          telefone: formData.phone,
          assunto: formData.subject,
          orcamento: formData.budget,
          prazo: formData.deadline,
          mensagem: formData.message,
        }),
      })

      if (response.ok) {
        setSubmitSuccess(true)
        setFormData({
          name: "",
          company: "",
          email: "",
          phone: "",
          subject: "",
          budget: "",
          deadline: "",
          message: "",
        })
        setTimeout(() => setSubmitSuccess(false), 5000)
      }
    } catch (error) {
      console.error("Erro ao enviar:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0118]">
      <SocialFloat />

      <div className="fixed inset-0 bg-[#0a0118]">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 animate-mesh-gradient" />

        {/* Main orbs with floating animation */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/40 rounded-full blur-3xl animate-float-orb" />
        <div
          className="absolute top-2/3 right-1/4 w-96 h-96 bg-blue-600/40 rounded-full blur-3xl animate-float-orb"
          style={{ animationDelay: "-5s" }}
        />
        <div
          className="absolute top-1/2 left-2/3 w-72 h-72 bg-pink-600/30 rounded-full blur-3xl animate-float-orb"
          style={{ animationDelay: "-10s" }}
        />

        {/* Additional orbs for more dynamic effect */}
        <div
          className="absolute top-1/3 right-1/3 w-64 h-64 bg-violet-500/30 rounded-full blur-3xl animate-float-orb"
          style={{ animationDelay: "-15s" }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-600/25 rounded-full blur-3xl animate-float-orb"
          style={{ animationDelay: "-8s" }}
        />

        {/* Particles - using deterministic values to avoid hydration mismatch */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => {
            const left = ((i * 17 + 23) % 100)
            const top = ((i * 31 + 47) % 100)
            const delay = ((i * 7) % 20)
            const duration = 20 + ((i * 3) % 10)
            return (
              <div
                key={i}
                className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-particles"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
              />
            )
          })}
        </div>
      </div>

      <div className="relative z-10">
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/5 animate-navbar">
          <nav className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <a href="#" className="flex items-center gap-4 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 group-hover:blur-2xl transition-all duration-500" />
                  <Image
                    src="/images/gv-logo-new.png"
                    alt="GV Software"
                    width={55}
                    height={55}
                    className="relative rounded-2xl shadow-2xl group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-2xl font-black bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-pink-400 transition-all duration-300">
                    GV Software
                  </h2>
                  <p className="text-xs font-medium bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent tracking-widest uppercase">
                    Inovação & Tecnologia
                  </p>
                </div>
              </a>

              <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
                <a
                  href="#projetos"
                  className="relative group flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300"
                >
                  <Folder className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
                  <span className="text-base font-semibold bg-gradient-to-r from-gray-100 to-purple-200 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300">
                    Portfólio
                  </span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                </a>
              </div>

              <div className="flex items-center gap-4">
                <a
                  href="#contato"
                  className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm
                    bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-[length:200%_100%]
                    hover:bg-[position:100%_0] transition-all duration-500
                    shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)]
                    hover:scale-105 text-white"
                >
                  <Sparkles size={16} />
                  Solicitar Orçamento
                </a>

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden text-white"
                  aria-label="Menu"
                >
                  {mobileMenuOpen ? <ArrowRight size={28} /> : <Users size={28} />}
                </button>
              </div>
            </div>

            {mobileMenuOpen && (
              <div className="md:hidden backdrop-blur-xl bg-black/90 border-t border-white/5 animate-fade-in-down">
                <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
                  <a
                    href="#projetos"
                    className="text-lg text-gray-300 hover:text-purple-400 transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Portfólio
                  </a>
                  <a
                    href="#contato"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-full font-semibold
                      bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600
                      shadow-[0_0_20px_rgba(168,85,247,0.5)] text-white"
                  >
                    <Sparkles size={16} />
                    Solicitar Orçamento
                  </a>
                </div>
              </div>
            )}
          </nav>
        </header>

        <section className="min-h-screen flex items-center justify-center px-6 pt-20">
          <div className="container mx-auto text-center space-y-8 max-w-5xl">
            <div className="scroll-reveal slide-down">
              <h1 className="text-6xl md:text-8xl font-bold text-balance leading-tight mb-6">
                Transformando
                <br />
                suas <span className="text-gradient">ideias</span> em
                <br />
                <span className="text-gradient">realidade digital</span>
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto text-balance scroll-reveal slide-up delay-200">
              Criamos soluções digitais inovadoras que impulsionam o crescimento do seu negócio com{" "}
              <span className="text-purple-400 font-semibold">tecnologia de ponta</span> e{" "}
              <span className="text-pink-400 font-semibold">design excepcional</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 scroll-reveal zoom-in delay-400">
              <Button size="lg" className="gradient-tech hover-lift border-0 text-lg px-8 py-6 h-auto">
                <a href="#projetos" className="flex items-center gap-2">
                  Ver Projetos
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="glass border-purple-500/50 hover:bg-purple-500/20 text-lg px-8 py-6 h-auto bg-transparent"
              >
                <a href="#contato">Solicitar Orçamento</a>
              </Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-32 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="glass-card rounded-3xl p-12 md:p-16 scroll-reveal slide-up">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h2 className="text-5xl font-bold text-white mb-4">
                    Sobre a <span className="text-gradient">GV Software</span>
                  </h2>
                  {loadingAbout ? (
                    <div className="space-y-4">
                      <div className="h-4 bg-gray-700/50 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-700/50 rounded animate-pulse w-3/4"></div>
                    </div>
                  ) : (
                    <p className="text-lg text-gray-300 leading-relaxed">{String(aboutData.description || "")}</p>
                  )}
                  <p className="text-lg text-gray-300 leading-relaxed">
                    Nossa missão é tornar a tecnologia acessível e poderosa para empresas de todos os tamanhos,
                    entregando projetos que superam expectativas e geram valor real.
                  </p>
                  <div className="flex gap-4 pt-4">
                    <div className="glass-card rounded-xl p-4 text-center flex-1">
                      <div className="text-3xl font-bold text-gradient">
                        {loadingAbout ? "..." : `${aboutData.projects_count}+`}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Projetos</div>
                    </div>
                    <div className="glass-card rounded-xl p-4 text-center flex-1">
                      <div className="text-3xl font-bold text-gradient">
                        {loadingAbout ? "..." : `${aboutData.clients_count}+`}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Clientes</div>
                    </div>
                    <div className="glass-card rounded-xl p-4 text-center flex-1">
                      <div className="text-3xl font-bold text-gradient">
                        {loadingAbout ? "..." : `${aboutData.years_experience}+`}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Anos</div>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="aspect-square rounded-3xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 p-1">
                    <div className="w-full h-full rounded-3xl bg-[#0a0118] flex items-center justify-center">
                      <Image
                        src="/images/gv-logo-new.png"
                        alt="GV Software"
                        width={300}
                        height={300}
                        className="animate-glow"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="habilidades" className="py-32 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16 scroll-reveal slide-down">
              <h2 className="text-5xl font-bold text-white mb-4">
                Nossas <span className="text-gradient">Habilidades</span>
              </h2>
              <p className="text-xl text-gray-300">Tecnologias e ferramentas que dominamos</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {loadingSkills ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="glass-card rounded-2xl p-8 animate-pulse">
                    <div className="w-16 h-16 rounded-xl bg-white/10 mb-4" />
                    <div className="h-5 w-24 rounded bg-white/10" />
                  </div>
                ))
              ) : (
                skills.map((skill, index) => {
                  const Icon = iconMap[skill.icon] || Code2
                  const delays = ["delay-100", "delay-200", "delay-300", "delay-400"]
                  return (
                    <div
                      key={skill.id}
                      className={`glass-card rounded-2xl p-8 hover-lift group cursor-pointer scroll-reveal zoom-in ${delays[index % 4]}`}
                    >
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: `${skill.color}20` }}
                      >
                        <Icon className="w-8 h-8" style={{ color: skill.color }} />
                      </div>
                      <h3 className="text-lg font-semibold text-white">{skill.name}</h3>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </section>

        <section id="projetos" className="relative py-32 px-6 overflow-hidden">
          {/* Background decorativo */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 -right-48 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[150px]" />
            <div className="absolute bottom-1/3 -left-48 w-[500px] h-[500px] bg-cyan-600/15 rounded-full blur-[150px]" />
          </div>

          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="text-center mb-16 scroll-reveal slide-down">
              <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-sm font-medium text-purple-300 mb-6">
                Portfolio
              </span>
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
                Nossos <span className="text-gradient">Projetos</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Conheca alguns dos nossos trabalhos mais recentes e veja como transformamos ideias em solucoes digitais
              </p>
            </div>

            {loadingProjects ? (
              <div className="flex justify-center items-center py-20">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                  <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-r-cyan-500/50 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
                </div>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                  <Folder className="w-12 h-12 text-gray-500" />
                </div>
                <p className="text-gray-400 text-lg mb-2">Nenhum projeto cadastrado ainda</p>
                <p className="text-gray-500 text-sm">Os projetos aparecerao aqui assim que forem adicionados</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Seção de Contato - REDESENHADA */}
        <section id="contato" className="relative py-32 px-6 overflow-hidden">
          {/* Background decorativo */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px]" />
          </div>

          <div className="container mx-auto max-w-7xl relative z-10">
            {/* Header */}
            <div className="text-center mb-20 scroll-reveal slide-down">
              <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-sm font-medium text-purple-300 mb-6">
                Vamos Conversar
              </span>
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Transforme sua <span className="text-gradient">Visao</span> em{" "}
                <span className="text-gradient">Realidade</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Estamos prontos para entender seu projeto e criar solucoes sob medida para o seu negocio
              </p>
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
              {/* Lado esquerdo - Info cards */}
              <div className="lg:col-span-2 space-y-6 scroll-reveal slide-right">
                {/* Card principal */}
                <div className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/25">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Projeto Personalizado</h3>
                    <p className="text-gray-400 leading-relaxed">
                      Cada projeto e unico. Desenvolvemos solucoes 100% personalizadas para atender as necessidades especificas do seu negocio.
                    </p>
                  </div>
                </div>

                {/* Cards de contato */}
                <div className="grid grid-cols-1 gap-4">
                  <a 
                    href="mailto:contato.gvsoftware@gmail.com" 
                    className="glass-card rounded-2xl p-5 border border-white/10 flex items-center gap-4 group hover:border-purple-500/50 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/20">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500 mb-0.5">E-mail</p>
                      <p className="text-white font-medium truncate">contato.gvsoftware@gmail.com</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                  </a>

                  <a 
                    href="https://wa.me/5517997853416" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card rounded-2xl p-5 border border-white/10 flex items-center gap-4 group hover:border-green-500/50 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/20">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500 mb-0.5">WhatsApp</p>
                      <p className="text-white font-medium">(17) 99785-3416</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
                  </a>

                  <a
                    href="https://www.instagram.com/gv_software/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card rounded-2xl p-5 border border-white/10 flex items-center gap-4 group hover:border-pink-500/50 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-pink-500/20">
                      <Instagram className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500 mb-0.5">Instagram</p>
                      <p className="text-white font-medium">@gv_software</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-pink-400 group-hover:translate-x-1 transition-all" />
                  </a>
                </div>
              </div>

              {/* Lado direito - Formulario */}
              <div className="lg:col-span-3 scroll-reveal slide-left delay-200">
                <div className="glass-card rounded-3xl p-8 md:p-10 border border-white/10 relative overflow-hidden">
                  {/* Decoracao do form */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-cyan-500/20 to-transparent rounded-full blur-3xl" />
                  
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-2">Envie sua mensagem</h3>
                    <p className="text-gray-400 mb-8">Preencha o formulario e retornaremos em ate 24 horas</p>

                    {submitSuccess && (
                      <div className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        </div>
                        <p className="text-green-400 font-medium">
                          Mensagem enviada com sucesso! Retornaremos em breve.
                        </p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Linha 1: Nome e Empresa */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity" />
                        <div className="relative">
                          <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                          <Input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Seu nome completo *"
                            required
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all"
                          />
                        </div>
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity" />
                        <div className="relative">
                          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                          <Input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            placeholder="Empresa (opcional)"
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Linha 2: Email e Telefone */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity" />
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Seu melhor e-mail *"
                            required
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all"
                          />
                        </div>
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity" />
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                          <Input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="WhatsApp *"
                            required
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Linha 3: Assunto */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity" />
                      <div className="relative">
                        <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors z-10" />
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-12 pr-10 py-4 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all appearance-none cursor-pointer"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 1rem center",
                            backgroundSize: "1.25rem",
                          }}
                        >
                          <option value="" disabled className="bg-[#0a0a0a]">Tipo de projeto *</option>
                          <option value="Site Institucional" className="bg-[#0a0a0a]">Site Institucional</option>
                          <option value="Loja Virtual / E-commerce" className="bg-[#0a0a0a]">Loja Virtual / E-commerce</option>
                          <option value="Sistema Web / Aplicativo" className="bg-[#0a0a0a]">Sistema Web / Aplicativo</option>
                          <option value="Landing Page" className="bg-[#0a0a0a]">Landing Page</option>
                          <option value="Manutenção / Suporte" className="bg-[#0a0a0a]">Manutencao / Suporte</option>
                          <option value="Consultoria" className="bg-[#0a0a0a]">Consultoria</option>
                          <option value="Outro" className="bg-[#0a0a0a]">Outro</option>
                        </select>
                      </div>
                    </div>

                    {/* Linha 4: Orçamento e Prazo */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all appearance-none cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 1rem center",
                          backgroundSize: "1.25rem",
                        }}
                      >
                        <option value="" className="bg-[#0a0a0a]">Orcamento (opcional)</option>
                        <option value="Até R$ 1.000" className="bg-[#0a0a0a]">Ate R$ 1.000</option>
                        <option value="R$ 1.000 - R$ 3.000" className="bg-[#0a0a0a]">R$ 1.000 - R$ 3.000</option>
                        <option value="R$ 3.000 - R$ 5.000" className="bg-[#0a0a0a]">R$ 3.000 - R$ 5.000</option>
                        <option value="R$ 5.000 - R$ 10.000" className="bg-[#0a0a0a]">R$ 5.000 - R$ 10.000</option>
                        <option value="Acima de R$ 10.000" className="bg-[#0a0a0a]">Acima de R$ 10.000</option>
                      </select>
                      <select
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all appearance-none cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 1rem center",
                          backgroundSize: "1.25rem",
                        }}
                      >
                        <option value="" className="bg-[#0a0a0a]">Prazo (opcional)</option>
                        <option value="Urgente (até 1 semana)" className="bg-[#0a0a0a]">Urgente (ate 1 semana)</option>
                        <option value="Curto (1-2 semanas)" className="bg-[#0a0a0a]">Curto (1-2 semanas)</option>
                        <option value="Médio (2-4 semanas)" className="bg-[#0a0a0a]">Medio (2-4 semanas)</option>
                        <option value="Flexível (1-2 meses)" className="bg-[#0a0a0a]">Flexivel (1-2 meses)</option>
                        <option value="Sem pressa" className="bg-[#0a0a0a]">Sem pressa</option>
                      </select>
                    </div>

                    {/* Linha 5: Mensagem */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity" />
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Conte-nos sobre seu projeto... *"
                        required
                        rows={4}
                        className="relative w-full px-4 py-4 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all resize-none"
                      />
                    </div>

                    {/* Botao de envio */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-14 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_100%] hover:bg-[position:100%_0] border-0 text-base font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          Enviar Mensagem
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>

                    <p className="text-center text-gray-500 text-sm">* Campos obrigatorios</p>
                  </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="relative py-12 px-6">
          {/* Efeito de glow sutil */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[150px] bg-purple-600/5 rounded-full blur-3xl" />

          <div className="container mx-auto relative z-10">
            {/* Conteúdo principal */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
              {/* Logo e nome */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/50 to-cyan-500/50 rounded-xl blur-md opacity-50" />
                  <Image
                    src="/images/gv-logo-new.png"
                    alt="GV Software"
                    width={45}
                    height={45}
                    className="relative rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">GV Software</h3>
                  <p className="text-xs text-purple-400/80">Inovação & Tecnologia</p>
                </div>
              </div>

              {/* Redes sociais */}
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/gv_software/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-2.5 rounded-lg bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
                >
                  <Instagram className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                </a>
                <a
                  href="mailto:contato.gvsoftware@gmail.com"
                  className="group p-2.5 rounded-lg bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
                >
                  <Mail className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                </a>
                <a
                  href="tel:+5517997853416"
                  className="group p-2.5 rounded-xl bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
                >
                  <Phone className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                </a>
              </div>
            </div>

            {/* Linha divisória sutil */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

            <p className="text-center text-base md:text-lg font-medium text-white/80">
              © 2025{" "}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent font-bold">
                GV Software
              </span>
              . Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
