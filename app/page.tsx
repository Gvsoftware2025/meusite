"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { SocialFloat } from "@/components/social-float"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Code2,
  Database,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Users,
  Zap,
  Mail,
  Phone,
  MapPin,
  Server,
  FileCode,
  Terminal,
  Leaf,
  Box,
  Cloud,
  GitBranch,
  Palette,
  Share2,
  Sparkles,
  Globe,
  Layers,
  type LucideIcon,
  Menu,
  X,
} from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"

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
  Sparkles,
  Globe,
  Layers,
}

interface Project {
  id: string
  title: string
  description: string
  image_url: string
  project_url: string
  technologies: string[]
  is_featured: boolean
  display_order: number
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

const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#servicos", label: "Servicos" },
  { href: "#projetos", label: "Projetos" },
  { href: "#skills", label: "Stack" },
  { href: "#contato", label: "Contato" },
]

const services = [
  {
    icon: Globe,
    title: "Desenvolvimento Web",
    description: "Sites e aplicacoes web modernas com as melhores tecnologias do mercado.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: Layers,
    title: "Aplicacoes SaaS",
    description: "Plataformas escaláveis e seguras para o seu negocio crescer.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Database,
    title: "Sistemas & APIs",
    description: "Integrações robustas e sistemas sob medida para sua empresa.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Zap,
    title: "Automação",
    description: "Automatize processos e aumente a produtividade do seu time.",
    gradient: "from-green-500 to-emerald-500",
  },
]

export default function PortfolioPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [skills, setSkills] = useState<Skill[]>([])
  const [loadingSkills, setLoadingSkills] = useState(true)
  const [aboutData, setAboutData] = useState<AboutData>({
    description: "Transformamos ideias em solucoes digitais de alto impacto.",
    projects_count: 50,
    clients_count: 100,
    years_experience: 5,
  })
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!supabase) {
      setLoadingProjects(false)
      setLoadingSkills(false)
      return
    }

    const fetchData = async () => {
      const [projectsRes, skillsRes, aboutRes] = await Promise.all([
        supabase.from("portfolio_projects").select("*").order("display_order", { ascending: true }),
        supabase.from("portfolio_skills").select("*").order("display_order", { ascending: true }),
        supabase.from("portfolio_about").select("*").order("created_at", { ascending: false }).limit(1).single(),
      ])

      if (projectsRes.data) setProjects(projectsRes.data)
      if (skillsRes.data) setSkills(skillsRes.data)
      if (aboutRes.data) {
        setAboutData({
          description: aboutRes.data.description || aboutData.description,
          projects_count: aboutRes.data.projects_count || 50,
          clients_count: aboutRes.data.clients_count || 100,
          years_experience: aboutRes.data.years_experience || 5,
        })
      }
      setLoadingProjects(false)
      setLoadingSkills(false)
    }

    fetchData()

    const channel = supabase
      .channel("portfolio_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "portfolio_projects" }, () => {
        supabase.from("portfolio_projects").select("*").order("display_order", { ascending: true }).then((res) => {
          if (res.data) setProjects(res.data)
        })
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [supabase])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("revealed")
      }),
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    )
    document.querySelectorAll(".scroll-reveal").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (supabase) {
        await supabase.from("portfolio_contacts").insert({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        })
      }
      setSubmitSuccess(true)
      setFormData({ name: "", email: "", message: "" })
      setTimeout(() => setSubmitSuccess(false), 5000)
    } catch (error) {
      console.error("Erro ao enviar:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Noise overlay */}
      <div className="noise" />
      
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 gradient-mesh opacity-50" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        
        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[100px] animate-blob" />
        <div className="absolute top-2/3 right-1/4 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] animate-blob delay-1000" />
        <div className="absolute bottom-1/4 left-1/2 w-[300px] h-[300px] bg-pink-500/15 rounded-full blur-[80px] animate-blob delay-500" />
      </div>

      <SocialFloat />

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-header py-3" : "py-6"
      }`}>
        <nav className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
              <Image
                src="/images/gv-logo-new.png"
                alt="GV Software"
                width={48}
                height={48}
                className="relative rounded-xl"
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold gradient-text">GV Software</span>
              <p className="text-xs text-muted-foreground">Desenvolvimento Web</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
            <Button className="btn-primary text-sm">
              <span className="relative z-10">Iniciar Projeto</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 glass rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 glass-header border-t border-white/5 p-6">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-foreground py-2"
                >
                  {link.label}
                </a>
              ))}
              <Button className="btn-primary mt-4">Iniciar Projeto</Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="inicio" className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 animate-slide-down">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">Disponivel para novos projetos</span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-slide-up">
              <span className="block text-foreground">Criamos</span>
              <span className="block gradient-text-shimmer animate-shimmer">
                Experiencias Digitais
              </span>
              <span className="block text-foreground">Memoraveis</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up delay-200">
              {aboutData.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-300">
              <a href="#contato" className="btn-primary inline-flex items-center justify-center gap-2">
                <span className="relative z-10">Fale Conosco</span>
                <ArrowRight className="w-4 h-4 relative z-10" />
              </a>
              <a href="#projetos" className="btn-outline inline-flex items-center justify-center gap-2">
                Ver Projetos
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-16 pt-16 border-t border-white/10 animate-slide-up delay-500">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold gradient-text">{aboutData.projects_count}+</div>
                <div className="text-sm text-muted-foreground mt-1">Projetos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold gradient-text">{aboutData.clients_count}+</div>
                <div className="text-sm text-muted-foreground mt-1">Clientes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold gradient-text">{aboutData.years_experience}+</div>
                <div className="text-sm text-muted-foreground mt-1">Anos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-muted-foreground">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-slide-up" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="relative py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-cyan-400 tracking-wider uppercase scroll-reveal slide-up">
              Nossos Servicos
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-4 scroll-reveal slide-up delay-100">
              O que <span className="gradient-text">fazemos</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <div
                key={service.title}
                className={`glass-card glass-card-hover rounded-2xl p-6 scroll-reveal slide-up delay-${(i + 1) * 100}`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4`}>
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projetos" className="relative py-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-16">
            <div>
              <span className="text-sm font-medium text-purple-400 tracking-wider uppercase scroll-reveal slide-up">
                Portfolio
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold mt-4 scroll-reveal slide-up delay-100">
                Projetos em <span className="gradient-text">Destaque</span>
              </h2>
            </div>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 group scroll-reveal slide-up delay-200">
              Ver todos
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {loadingProjects ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-video bg-white/5" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-white/5 rounded w-2/3" />
                    <div className="h-4 bg-white/5 rounded w-full" />
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-white/5 rounded-full" />
                      <div className="h-6 w-16 bg-white/5 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : projects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, i) => (
                <a
                  key={project.id}
                  href={project.project_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`glass-card glass-card-hover rounded-2xl overflow-hidden group scroll-reveal slide-up delay-${(i % 3 + 1) * 100}`}
                >
                  <div className="aspect-video relative overflow-hidden">
                    {project.image_url ? (
                      <Image
                        src={project.image_url}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                        <Code2 className="w-12 h-12 text-white/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-cyan-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies?.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-3 py-1 rounded-full bg-white/5 text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 glass-card rounded-2xl">
              <Code2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Projetos em breve...</p>
            </div>
          )}
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="relative py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-pink-400 tracking-wider uppercase scroll-reveal slide-up">
              Tecnologias
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-4 scroll-reveal slide-up delay-100">
              Nossa <span className="gradient-text">Stack</span>
            </h2>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {loadingSkills ? (
              Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="glass-card rounded-xl p-4 flex flex-col items-center gap-3 animate-pulse">
                  <div className="w-10 h-10 rounded-lg bg-white/5" />
                  <div className="h-4 w-16 bg-white/5 rounded" />
                </div>
              ))
            ) : (
              skills.map((skill, i) => {
                const Icon = iconMap[skill.icon] || Code2
                return (
                  <div
                    key={skill.id}
                    className={`glass-card glass-card-hover rounded-xl p-4 flex flex-col items-center gap-3 scroll-reveal zoom-in delay-${(i % 6) * 75}`}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${skill.color}15` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: skill.color }} />
                    </div>
                    <span className="text-xs font-medium text-center">{skill.name}</span>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="relative py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-sm font-medium text-green-400 tracking-wider uppercase scroll-reveal slide-up">
                Contato
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold mt-4 scroll-reveal slide-up delay-100">
                Vamos <span className="gradient-text">Conversar?</span>
              </h2>
              <p className="text-muted-foreground mt-4 max-w-lg mx-auto scroll-reveal slide-up delay-200">
                Conte-nos sobre seu projeto e vamos transformar sua ideia em realidade.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-8 md:p-12 scroll-reveal scale-in delay-300">
              {submitSuccess ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Mensagem Enviada!</h3>
                  <p className="text-muted-foreground">Entraremos em contato em breve.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">Nome</label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Seu nome"
                        required
                        className="bg-white/5 border-white/10 focus:border-cyan-500/50 h-12"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">Email</label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="seu@email.com"
                        required
                        className="bg-white/5 border-white/10 focus:border-cyan-500/50 h-12"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Mensagem</label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Conte-nos sobre seu projeto..."
                      required
                      rows={5}
                      className="bg-white/5 border-white/10 focus:border-cyan-500/50 resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full h-12 text-base"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                      {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                    </span>
                  </Button>
                </form>
              )}
            </div>

            {/* Contact info */}
            <div className="grid sm:grid-cols-3 gap-6 mt-12">
              <div className="flex items-center gap-4 glass-card rounded-xl p-4 scroll-reveal slide-up delay-400">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">contato@gvsoftware.tech</p>
                </div>
              </div>
              <div className="flex items-center gap-4 glass-card rounded-xl p-4 scroll-reveal slide-up delay-500">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Telefone</p>
                  <p className="text-sm font-medium">(11) 99999-9999</p>
                </div>
              </div>
              <div className="flex items-center gap-4 glass-card rounded-xl p-4 scroll-reveal slide-up delay-700">
                <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Local</p>
                  <p className="text-sm font-medium">Sao Paulo, Brasil</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/gv-logo-new.png"
                alt="GV Software"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-sm text-muted-foreground">
                © 2024 GV Software. Todos os direitos reservados.
              </span>
            </div>
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
