import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBalanceScale, FaGavel, FaBriefcase, FaHandshake, FaBars, FaTimes, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import logo from "C:/Users/SEVEN/Desktop/AAAA Site estruturado escritorio mfs/dashboard-ui-design-main/src/assets/LOGO mfs.png";
import logo2 from "../../../public/favicon-dark.svg";
import sidnei from "../../assets/adv/sidnei.jpeg"
import rafaela from "../../assets/adv/rafaela.jpeg"
import vinmerson from "../../assets/adv/vinmerson.jpeg"
import icaro2 from "../../assets/adv/icaro2.jpeg"
const Ladingpage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const practiceAreas = [
    { icon: <FaBalanceScale />, title: "Direito Civil", description: "Especialização em casos civis complexos" },
    { icon: <FaGavel />, title: "Direito Penal", description: "Defesa criminal especializada" },
    { icon: <FaBriefcase />, title: "Direito Empresarial", description: "Consultoria empresarial completa" },
    { icon: <FaHandshake />, title: "Direito Trabalhista", description: "Proteção dos direitos trabalhistas" },
    { icon: <FaBalanceScale />, title: "Direito Civil", description: "Especialização em casos civis complexos" },
    { icon: <FaGavel />, title: "Direito Penal", description: "Defesa criminal especializada" },
    { icon: <FaBriefcase />, title: "Direito Empresarial", description: "Consultoria empresarial completa" },
    { icon: <FaHandshake />, title: "Direito Trabalhista", description: "Proteção dos direitos trabalhistas" },
  ];

  const lawyers = [
    {
      name: "Dr. Sidnei Marques",
      role: "Sócio",
      image: sidnei,
      //specialty: "Direito Empresarial"
    },
    {
      name: "Dra. Rafaela Nascimento",
      role: "Sócia",
      image: rafaela,
      //specialty: "Direito Empresarial"
    },
    {
      name: "Dr. Vinmerson Freitas",
      role: "Sócio ",
      image: vinmerson,
     // specialty: "Direito Empresarial"
    },
    {
      name: "Dra. Icaro França",
      role: "Sócio",
      image: icaro2,
    //  specialty: "Direito Civil"
    }
  ];

  const testimonials = [
    {
      text: "Excelente atendimento e profissionalismo incomparável.",
      author: "João Mendes - CEO"
    },
    {
      text: "Resultados extraordinários em casos complexos.",
      author: "Ana Lima - Empresária"
    }
  ];

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#0F172A] to-[#1F2937]"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
          className="h-48"
        >
          <img src={logo} alt="Marques França e Santos Advocacia & Consultoria" className="h-full" />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="bg-[#0F172A] min-h-screen text-[#F3E5AB]">
      {/* Header */}
      <header className="fixed w-full bg-gradient-to-r from-[#1F2937]/90 to-[#D4AF37]/20 h-20 z-50">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex items-center"
          >
            <img src={logo} alt="Silva & Associados" className="h-16" />
          </motion.div>

          <nav className="hidden md:flex space-x-8">
            {["Sobre Nós", "Áreas de Atuação", "Advogados", "Contato"].map((item) => (
              <button
                key={item}
                className="text-[#D4AF37] hover:text-[#F3E5AB] hover:underline transition-colors"
              >
                {item}
              </button>
            ))}
            <button
              className="text-[#D4AF37] hover:text-[#F3E5AB] hover:underline transition-colors"
              onClick={() => window.location.href = '/Login'}
            >
              Área do Adv
            </button>
          </nav>

          <button
            className="md:hidden text-[#D4AF37]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 left-0 w-full bg-[#1F2937] md:hidden z-50"
            >
              <div className="flex flex-col items-center py-4 space-y-4">
                {["Sobre Nós", "Áreas de Atuação", "Advogados", "Contato"].map((item) => (
                  <button
                    key={item}
                    className="text-[#D4AF37] hover:text-[#F3E5AB] hover:underline transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </button>
                ))}
                <button
                  className="text-[#D4AF37] hover:text-[#F3E5AB] hover:underline transition-colors"
                  onClick={() => {
                    setIsMenuOpen(false);
                    window.location.href = '/Login';
                  }}
                >
                  Área do Adv
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f')"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#1F2937]/80 to-[#D4AF37]/20" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-20"
          >
            <h1 className="text-5xl font-serif font-bold text-[#D4AF37] mb-6">
              Excelência Jurídica e Tradição
            </h1>
            <p className="text-xl mb-8">
              Defendendo seus direitos com comprometimento e experiência.
            </p>
            <button className="text-white bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 hover:bg-gradient-to-br  dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-yellow-800/80 font-medium rounded-3xl text-sm px-5 py-3 text-center me-2 mb-2 ">
              Agende uma Consulta
            </button>
          </motion.div>
        </div>
      </section>

      {/* Practice Areas */}
      <section className="py-20 bg-[#1F2937]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif text-center text-[#D4AF37] mb-12">
            Áreas de Atuação
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {practiceAreas.map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 border border-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/10 transition-colors"
              >
                <div className="text-4xl text-[#D4AF37] mb-4">{area.icon}</div>
                <h3 className="text-xl font-serif text-[#D4AF37] mb-2">{area.title}</h3>
                <p>{area.description}</p>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <button className="text-white bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 hover:bg-gradient-to-br dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-yellow-800/80 font-medium rounded-3xl text-sm px-5 py-3 text-center">
              Agende uma Consulta
            </button>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif text-center text-[#D4AF37] mb-12">Nossa Equipe</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {lawyers.map((lawyer, index) => (
              <motion.div
                key={lawyer.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#D4AF37] mb-6">
                  <img
                    src={lawyer.image}
                    alt={lawyer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-serif text-[#D4AF37] mb-2">{lawyer.name}</h3>
                <p className="text-lg mb-2">{lawyer.role}</p>
                <p className="text-[#F3E5AB]/80">{lawyer.specialty}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-[#1F2937]">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 items-start gap-16 p-4 mx-auto max-w-4xl text-[#F3E5AB] font-[sans-serif]">
            <div>
              <h1 className="text-[#D4AF37] text-3xl font-extrabold">Let's Talk</h1>
              <p className="text-sm text-[#F3E5AB] mt-4">Have some big idea or brand to develop and need help? Then reach out we'd love to hear about your project and provide help.</p>

            {/*   <div className="mt-12">
                <h2 className="text-[#D4AF37] text-base font-bold">Email</h2>
                <ul className="mt-4">
                  <li className="flex items-center">
                    <div className="bg-[#0d1340] h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill='#D4AF37' viewBox="0 0 479.058 479.058">
                        <path d="M434.146 59.882H44.912C20.146 59.882 0 80.028 0 104.794v269.47c0 24.766 20.146 44.912 44.912 44.912h389.234c24.766 0 44.912-20.146 44.912-44.912v-269.47c0-24.766-20.146-44.912-44.912-44.912zm0 29.941c2.034 0 3.969.422 5.738 1.159L239.529 264.631 39.173 90.982a14.902 14.902 0 0 1 5.738-1.159zm0 299.411H44.912c-8.26 0-14.971-6.71-14.971-14.971V122.615l199.778 173.141c2.822 2.441 6.316 3.655 9.81 3.655s6.988-1.213 9.81-3.655l199.778-173.141v251.649c-.001 8.26-6.711 14.97-14.971 14.97z" />
                      </svg>
                    </div>
                    <a href="mailto:info@example.com" className="text-[#D4AF37] text-sm ml-4">
                      <small className="block">Mail</small>
                      <strong>info@example.com</strong>
                    </a>
                  </li>
                </ul>
              </div> */}

              <div className="mt-12">
                <h2 className="text-[#D4AF37] text-base font-bold">Socials</h2>
                <ul className="flex mt-4 space-x-4">
              {/*     <li className="bg-[#0d1340] h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                    <a href="javascript:void(0)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill='#D4AF37' viewBox="0 0 24 24">
                        <path d="M6.812 13.937H9.33v9.312c0 .414.335.75.75.75l4.007.001a.75.75 0 0 0 .75-.75v-9.312h2.387a.75.75 0 0 0 .744-.657l.498-4a.75.75 0 0 0-.744-.843h-2.885c.113-2.471-.435-3.202 1.172-3.202 1.088-.13 2.804.421 2.804-.75V.909a.75.75 0 0 0-.648-.743A26.926 26.926 0 0 0 15.071 0c-7.01 0-5.567 7.772-5.74 8.437H6.812a.75.75 0 0 0-.75.75v4c0 .414.336.75.75.75zm.75-3.999h2.518a.75.75 0 0 0 .75-.75V6.037c0-2.883 1.545-4.536 4.24-4.536.878 0 1.686.043 2.242.087v2.149c-.402.205-3.976-.884-3.976 2.697v2.755c0 .414.336.75.75.75h2.786l-.312 2.5h-2.474a.75.75 0 0 0-.75.75V22.5h-2.505v-9.312a.75.75 0 0 0-.75-.75H7.562z" />
                      </svg>
                    </a>
                  </li>
                  <li className="bg-[#0d1340] h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                    <a href="javascript:void(0)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill='#D4AF37' viewBox="0 0 511 512">
                        <path d="M111.898 160.664H15.5c-8.285 0-15 6.719-15 15V497c0 8.285 6.715 15 15 15h96.398c8.286 0 15-6.715 15-15V175.664c0-8.281-6.714-15-15-15zM96.898 482H30.5V190.664h66.398zM63.703 0C28.852 0 .5 28.352.5 63.195c0 34.852 28.352 63.2 63.203 63.2 34.848 0 63.195-28.352 63.195-63.2C126.898 28.352 98.551 0 63.703 0zm0 96.395c-18.308 0-33.203-14.891-33.203-33.2C30.5 44.891 45.395 30 63.703 30c18.305 0 33.195 14.89 33.195 33.195 0 18.309-14.89 33.2-33.195 33.2zm289.207 62.148c-22.8 0-45.273 5.496-65.398 15.777-.684-7.652-7.11-13.656-14.942-13.656h-96.406c-8.281 0-15 6.719-15 15V497c0 8.285 6.719 15 15 15h96.406c8.285 0 15-6.715 15-15V320.266c0-22.735 18.5-41.23 41.235-41.23 22.734 0 41.226 18.495 41.226 41.23V497c0 8.285 6.719 15 15 15h96.403c8.285 0 15-6.715 15-15V302.066c0-79.14-64.383-143.523-143.524-143.523zM466.434 482h-66.399V320.266c0-39.278-31.953-71.23-71.226-71.23-39.282 0-71.239 31.952-71.239 71.23V482h-66.402V190.664h66.402v11.082c0 5.77 3.309 11.027 8.512 13.524a15.01 15.01 0 0 0 15.875-1.82c20.313-16.294 44.852-24.907 70.953-24.907 62.598 0 113.524 50.926 113.524 113.523zm0 0" />
                      </svg>
                    </a>
                  </li> */}
                  <li className="bg-[#0d1340] h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                    <a href="javascript:void(0)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill='#D4AF37' viewBox="0 0 24 24">
                        <path d="M12 9.3a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4Zm0-1.8a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm5.85-.225a1.125 1.125 0 1 1-2.25 0 1.125 1.125 0 0 1 2.25 0ZM12 4.8c-2.227 0-2.59.006-3.626.052-.706.034-1.18.128-1.618.299a2.59 2.59 0 0 0-.972.633 2.601 2.601 0 0 0-.634.972c-.17.44-.265.913-.298 1.618C4.805 9.367 4.8 9.714 4.8 12c0 2.227.006 2.59.052 3.626.034.705.128 1.18.298 1.617.153.392.333.674.632.972.303.303.585.484.972.633.445.172.918.267 1.62.3.993.047 1.34.052 3.626.052 2.227 0 2.59-.006 3.626-.052.704-.034 1.178-.128 1.617-.298.39-.152.674-.333.972-.632.304-.303.485-.585.634-.972.171-.444.266-.918.299-1.62.047-.993.052-1.34.052-3.626 0-2.227-.006-2.59-.052-3.626-.034-.704-.128-1.18-.299-1.618a2.619 2.619 0 0 0-.633-.972 2.595 2.595 0 0 0-.972-.634c-.44-.17-.914-.265-1.618-.298-.993-.047-1.34-.052-3.626-.052ZM12 3c2.445 0 2.75.009 3.71.054.958.045 1.61.195 2.185.419A4.388 4.388 0 0 1 19.49 4.51c.457.45.812.994 1.038 1.595.222.573.373 1.227.418 2.185.042.96.054 1.265.054 3.71 0 2.445-.009 2.75-.054 3.71-.045.958-.196 1.61-.419 2.185a4.395 4.395 0 0 1-1.037 1.595 4.44 4.44 0 0 1-1.595 1.038c-.573.222-1.227.373-2.185.418-.96.042-1.265.054-3.71.054-2.445 0-2.75-.009-3.71-.054-.958-.045-1.61-.196-2.185-.419A4.402 4.402 0 0 1 4.51 19.49a4.414 4.414 0 0 1-1.037-1.595c-.224-.573-.374-1.227-.419-2.185C3.012 14.75 3 14.445 3 12c0-2.445.009-2.75.054-3.71s.195-1.61.419-2.185A4.392 4.392 0 0 1 4.51 4.51c.45-.458.994-.812 1.595-1.037.574-.224 1.226-.374 2.185-.419C9.25 3.012 9.555 3 12 3Z" />
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <section className="w-full space-y-4">
              <input type='text' placeholder='Name' className="w-full rounded-md py-3 px-4 bg-py-20 text-[#F3E5AB] text-sm outline-[#D4AF37] focus:bg-transparent" />
              <input type='email' placeholder='Email' className="w-full rounded-md py-3 px-4 bg-py-20 text-[#F3E5AB] text-sm outline-[#D4AF37] focus:bg-transparent" />
              <input type='text' placeholder='Subject' className="w-full rounded-md py-3 px-4 bg-py-20 text-[#F3E5AB] text-sm outline-[#D4AF37] focus:bg-transparent" />
              <textarea placeholder='Message' rows="6" className="w-full rounded-md px-4 bg-py-20 text-[#F3E5AB] text-sm pt-3 outline-[#D4AF37] focus:bg-transparent resize-none"></textarea>
              <button type='button' className="w-full text-white bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 hover:bg-gradient-to-br dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-yellow-800/80 font-medium rounded-3xl text-sm py-3 text-center">
                Enviar
              </button>
            </section>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 ">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif text-center text-[#D4AF37] mb-12">Depoimentos</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-8 border border-[#D4AF37] rounded-lg"
              >
                <p className="text-xl mb-4">"{testimonial.text}"</p>
                <p className="text-[#D4AF37]">{testimonial.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1F2937] py-12 border-t border-[#D4AF37]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
            <img src={logo2} alt="Marques França e Santos Advocacia & Consultoria" className="h-24" />
              <p>R. São Marcos, 73<br />Salvador - BA</p>
            </div>
            <div>
              <h3 className="text-xl font-serif text-[#D4AF37] mb-4">Contato</h3>
              <p>+55 (71) 98286-6985<br /> </p>
            </div>
            <div>
              <h3 className="text-xl font-serif text-[#D4AF37] mb-4">Redes Sociais</h3>
              <div className="flex space-x-4">
                {[ FaInstagram].map((Icon, index) => (
                  <button
                    key={index}
                    className="text-[#D4AF37] hover:text-[#F3E5AB] transition-colors"
                  >
                    <Icon size={24} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[#D4AF37]/30 text-center">
            <p>&copy; 2022 Marques França e Santos Advocacia & Consultoria. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Ladingpage;