import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

// DUMMY DATA (extracted from resume)
const portfolioData = {
  name: "Shahid Fakir",
  title: "Software Development Engineer",
  contact: {
    email: "shahidfakir48@gmail.com",
    phone: "+91 7499316285",
    linkedin: "https://www.linkedin.com/in/shahidFakir/",
    github: "https://github.com/Shahid-projects",
    instagram: "https://www.instagram.com/__shahid_28/"
  },
  about: "A passionate and driven Software Development Engineer with experience in building and optimizing scalable web applications and services. Proficient in full-stack development, with a strong foundation in data structures, algorithms, and cloud technologies. Eager to contribute to challenging projects and grow with a dynamic team.",
  skills: [
    { name: "Java", level: 90, icon: 'Code' },
    { name: "JavaScript", level: 95, icon: 'Code' },
    { name: "LLM Models", level: 85, icon: 'Code' },
    { name: "React", level: 95, icon: 'React' },
    { name: "Node.js", level: 90, icon: 'Server' },
    { name: "Spring Boot", level: 80, icon: 'Leaf' },
    { name: "AWS", level: 75, icon: 'Cloud' },
    { name: "Databases", level: 85, icon: 'Database' },
    { name: "HTML/CSS", level: 95, icon: 'Layout' },
    { name: "Git", level: 90, icon: 'GitBranch' },
  ],
  experience: [
    {
      role: "Software Development Engineer Internship",
      company: "Nobel Technology India Pvt Ltd",
      period: "July 2025 - Present",
      description: "Worked on low-level design and implementation for APIs for a redesigned Store Launch Tool. Redesigned an existing API, achieving a 90% reduction in latency. Implemented business and tech metrics in high-traffic micro-services and developed a feature for package returns in NA/EU regions.",
    },
    {
      role: "MERN Stack Internship",
      company: "Inovitrix India Pvt Ltd",
      period: "Feb 2024 - Mar 2025",
      description: "Developed a full-scale online food delivery platform. Integrated backend APIs for real-time data retrieval, enhancing user experience. Designed a user-friendly interface with real-time notifications and a ratings system.",
    },
  ],
  education: [
    {
      degree: "Masters of Computer Application",
      institution: "VPIMSR Collage Sangli",
      period: "2025 - 2026",
      cgpa: "8.5 CGPA",
    },
    {
      degree: "Bachelor of Technology in Computer Science",
      institution: "Willingdon College Sangli",
      period: "2021 - 2024",
      cgpa: "8.7 CGPA",
    },
  ],
  projects: [
    {
      title: "Registration Dashboard",
      description: "Developed a dynamic dashboard with MongoDB integration and a user-friendly interface. Implemented JWT authentication, user registration, login validation, and secure cookie management.",
      stack: ["React", "Node.js", "Express.js", "MongoDB", "Bootstrap"],
      link: "http://localhost:5173/",
    },
    {
      title: "Shahid-AI Q&A System",
      description: "Built an intelligent question-answering system using the Ollama CodeLlama model. The system handles natural language queries and delivers accurate responses through a Spring Boot backend and React.js frontend.",
      stack: ["Ollama Model", "Spring Boot", "Codellama", "React js"],
      link: "http://localhost:5175/",
    },
    {
      title: "Samart Waste Classification",
      description: "Upload an image of your waste and get instant classification with detailed segregation tips. Help create a cleaner, greener future through proper waste management.",
      stack: ["Nodejs", "Reactjs", "MongoDB"],
      link: "http://localhost:3000/",
    }
  ],
};


// --- MOCK ICONS (using Lucide icons names) ---
// In a real app, you would import these from 'lucide-react'
const icons = {
  Code: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>,
  React: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2"></circle><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48 0a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path></svg>,
  Server: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>,
  Leaf: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>,
  Cloud: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>,
  Database: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>,
  Layout: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>,
  GitBranch: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>,
  Mail: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
  Phone: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>,
  Linkedin: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>,
  Github: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>,
  Instagram: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
  Menu: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>,
  X: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  Briefcase: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>,
  GraduationCap: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>,
};

// --- HELPER COMPONENTS ---
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:5001/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
      // Use a more modern way to show success message
      alert(result.msg); // Or use a custom notification component
      setFormData({ name: '', email: '', message: '' });
    } else {
      // Show an error message from the server
      alert(`Error: ${result.msg}`);
    }
  } catch (error) {
    console.error('Submission error:', error);
    alert('An unexpected error occurred. Please try again.');
  }
};

// Animated Section Wrapper
const AnimatedSection = ({ children, id }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px 0px" });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.section
      id={id}
      ref={ref}
      className="py-20 lg:py-32"
      initial="hidden"
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
        hidden: { opacity: 0, y: 50 },
      }}
    >
      <div className="container mx-auto px-4">
        {children}
      </div>
    </motion.section>
  );
};

// Section Title
const SectionTitle = ({ children }) => (
  <h2 className="relative text-3xl lg:text-4xl font-bold text-center mb-12 lg:mb-16 text-slate-100">
    <span className="relative z-10">{children}</span>
    <motion.div
      className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 h-1 w-24 bg-gradient-to-r from-violet-500 to-indigo-500"
      initial={{ width: 0 }}
      whileInView={{ width: "6rem", transition: { duration: 0.5, delay: 0.2 } }}
      viewport={{ once: true }}
    />
  </h2>
);

// --- MAIN COMPONENTS ---

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ["About", "Skills", "Experience", "Projects", "Contact"];

  const scrollToSection = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/80 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center h-20">
        <motion.div
          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {portfolioData.name}
        </motion.div>
        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link, i) => (
            <motion.button
              key={link}
              onClick={() => scrollToSection(link)}
              className="text-slate-300 hover:text-violet-400 transition-colors duration-300"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
            >
              {link}
            </motion.button>
          ))}
        </nav>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-slate-300">
            {isOpen ? <icons.X /> : <icons.Menu />}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      <motion.div
        className="md:hidden bg-slate-900"
        initial={{ height: 0 }}
        animate={{ height: isOpen ? 'auto' : 0 }}
        style={{ overflow: 'hidden' }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center py-4">
          {navLinks.map((link) => (
            <button key={link} onClick={() => scrollToSection(link)} className="py-2 text-slate-300 hover:text-violet-400">
              {link}
            </button>
          ))}
        </div>
      </motion.div>
    </header>
  );
};

const Hero = () => {
  const particles = Array.from({ length: 50 });

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center bg-slate-900 text-white overflow-hidden">
      <div className="absolute inset-0 z-0 bg-grid-slate-800/20 [mask-image:linear-gradient(to_bottom,white_5%,transparent_90%)]"></div>
      <div className="absolute inset-0 z-0">
        {particles.map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            initial={{
              x: Math.random() * 100 + 'vw',
              y: Math.random() * 100 + 'vh',
              scale: Math.random() * 0.5 + 0.5,
              opacity: Math.random() * 0.5,
              backgroundColor: ['#8b5cf6', '#6366f1', '#ec4899'][i % 3]
            }}
            animate={{
              x: Math.random() * 100 + 'vw',
              y: Math.random() * 100 + 'vh',
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear',
            }}
            style={{
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
            }}
          />
        ))}
      </div>
      <div className="text-center z-10">
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-br from-violet-400 via-indigo-400 to-pink-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {portfolioData.name}
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-indigo-300 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {portfolioData.title}
        </motion.p>
        <motion.button
          onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-bold py-3 px-8 rounded-full hover:from-violet-600 hover:to-indigo-600 transition-all duration-300 shadow-lg shadow-indigo-500/30"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          View My Work
        </motion.button>
      </div>
    </section>
  );
};

const About = () => (
  <AnimatedSection id="about">
    <SectionTitle>About Me</SectionTitle>
    <div className="max-w-3xl mx-auto text-center text-slate-300 text-lg leading-relaxed">
      <p>{portfolioData.about}</p>
    </div>
  </AnimatedSection>
);

const Skills = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px 0px" });

  return (
    <AnimatedSection id="skills">
      <SectionTitle>Technical Skills</SectionTitle>
      <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {portfolioData.skills.map((skill, index) => {
          const Icon = icons[skill.icon] || icons.Code;
          return (
            <div key={index} className="flex flex-col items-center text-center p-4 bg-slate-800/50 rounded-lg shadow-md transition-all duration-300 hover:bg-slate-800 hover:-translate-y-2 border border-transparent hover:border-violet-500">
              <div className="text-violet-400 mb-3"><Icon size={40} /></div>
              <h3 className="font-semibold text-slate-200 mb-2">{skill.name}</h3>
              <div className="w-full bg-slate-700 rounded-full h-2.5">
                <motion.div
                  className="bg-gradient-to-r from-violet-500 to-indigo-500 h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${skill.level}%` } : {}}
                  transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </AnimatedSection>
  );
};

const TimelineItem = ({ icon, title, subtitle, period, description, isLast }) => {
  const IconComponent = icon === 'Briefcase' ? icons.Briefcase : icons.GraduationCap;

  return (
    <div className="relative flex items-start">
      <div className="flex flex-col items-center mr-6">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-800 inline-flex items-center justify-center text-violet-400 border-2 border-slate-700">
          <IconComponent />
        </div>
        {!isLast && <div className="w-px h-full bg-slate-700"></div>}
      </div>
      <div className="pb-16">
        <p className="text-sm text-indigo-400 mb-1">{period}</p>
        <h3 className="text-xl font-bold text-slate-100">{title}</h3>
        <h4 className="text-md font-medium text-slate-400 mb-3">{subtitle}</h4>
        <p className="text-slate-300 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

const Experience = () => (
  <AnimatedSection id="experience">
    <SectionTitle>Work Experience & Education</SectionTitle>
    <div className="grid md:grid-cols-2 gap-16">
      <div>
        <h3 className="text-2xl font-bold text-slate-200 mb-8 flex items-center"><icons.Briefcase className="mr-3 text-violet-400" />Experience</h3>
        <div className="relative">
          {portfolioData.experience.map((item, index) => (
            <TimelineItem
              key={index}
              icon="Briefcase"
              title={item.role}
              subtitle={item.company}
              period={item.period}
              description={item.description}
              isLast={index === portfolioData.experience.length - 1}
            />
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-slate-200 mb-8 flex items-center"><icons.GraduationCap className="mr-3 text-violet-400" />Education</h3>
        <div className="relative">
          {portfolioData.education.map((item, index) => (
            <TimelineItem
              key={index}
              icon="GraduationCap"
              title={item.degree}
              subtitle={item.institution}
              period={item.period}
              description={item.cgpa}
              isLast={index === portfolioData.education.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  </AnimatedSection>
);

const ProjectCard = ({ project, index }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px 0px" });

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.1 } });
    }
  }, [controls, inView, index]);

  return (
    <motion.div
      ref={ref}
      className="bg-slate-800/50 rounded-lg overflow-hidden group shadow-lg border border-slate-800"
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      whileHover={{ scale: 1.03, y: -10, boxShadow: "0 25px 50px -12px rgb(99 102 241 / 0.25)", borderColor: '#8b5cf6' }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-100 mb-2">{project.title}</h3>
        <p className="text-slate-400 mb-4 h-24">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.stack.map((tech) => (
            <span key={tech} className="bg-indigo-900/50 text-indigo-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {tech}
            </span>
          ))}
        </div>
        <a href={project.link} className="inline-block text-violet-400 font-semibold group-hover:underline">
          View Project &rarr;
        </a>
      </div>
    </motion.div>
  );
};

const Projects = () => (
  <AnimatedSection id="projects">
    <SectionTitle>Projects</SectionTitle>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {portfolioData.projects.map((project, index) => (
        <ProjectCard key={index} project={project} index={index} />
      ))}
    </div>
  </AnimatedSection>
);

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., send to an API)
    console.log('Form submitted:', formData);
    alert("Thank you for your message! I'll get back to you soon.");
    setFormData({ name: '', email: '', message: '' });
  };

  const socialLinks = [
    { icon: 'Mail', href: `mailto:${portfolioData.contact.email}` },
    { icon: 'Phone', href: `tel:${portfolioData.contact.phone}` },
    { icon: 'Linkedin', href: portfolioData.contact.linkedin, target: '_blank' },
    { icon: 'Github', href: portfolioData.contact.github, target: '_blank' },
    { icon: 'Instagram', href: portfolioData.contact.instagram, target: '_blank' },


  ];

  return (
    <AnimatedSection id="contact">
      <SectionTitle>Get In Touch</SectionTitle>
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        <div className="text-slate-300">
          <h3 className="text-2xl font-bold text-slate-100 mb-4">Contact Information</h3>
          <p className="mb-8">
            Feel free to reach out to me for any opportunities, collaborations, or just to say hi!
          </p>
          <div className="space-y-4 mb-8">
            {Object.entries(portfolioData.contact).map(([key, value]) => (
              <div key={key} className="flex items-center">
                <span className="text-violet-400 mr-3 capitalize">{key}:</span>
                <a href={key === 'email' ? `mailto:${value}` : value} className="hover:text-violet-400 transition-colors">{value}</a>
              </div>
            ))}
          </div>
          <div className="flex space-x-4">
            {socialLinks.map((link) => {
              const Icon = icons[link.icon];
              return (
                <motion.a
                  key={link.icon}
                  href={link.href}
                  target={link.target || '_self'}
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-800 rounded-full text-slate-300 hover:bg-gradient-to-br hover:from-violet-500 hover:to-indigo-500 hover:text-white transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon />
                </motion.a>
              );
            })}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Name</label>
            <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-md py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-md py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">Message</label>
            <textarea name="message" id="message" rows="4" required value={formData.message} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-md py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"></textarea>
          </div>
          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-bold py-3 px-6 rounded-md hover:from-violet-600 hover:to-indigo-600 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Send Message
          </motion.button>
        </form>
      </div>
    </AnimatedSection>
  );
};

const Footer = () => (
  <footer className="bg-slate-900 border-t border-slate-800 py-6">
    <div className="container mx-auto text-center text-slate-400">
      <p>&copy; {new Date().getFullYear()} {portfolioData.name}. All Rights Reserved.</p>
    </div>
  </footer>
);


// --- MAIN APP COMPONENT ---
export default function App() {
  // This effect is to add the necessary CDN links to the document's head
  useEffect(() => {
    const tailwindScript = document.getElementById('tailwind-cdn');
    if (!tailwindScript) {
      const tailwind = document.createElement('script');
      tailwind.id = 'tailwind-cdn';
      tailwind.src = 'https://cdn.tailwindcss.com';
      document.head.appendChild(tailwind);
    }

    document.body.style.backgroundColor = '#0f172a'; // slate-900
    document.body.classList.add('bg-slate-900');
  }, []);

  return (
    <div className="bg-slate-900 text-white font-sans">
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
