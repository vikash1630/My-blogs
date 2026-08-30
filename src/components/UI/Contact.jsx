// Contact.jsx
import React, { useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const subject = encodeURIComponent(`Portfolio contact from ${form.name}`)
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    )

    window.location.href = `mailto:m.vikash1630@gmail.com?cc=vikashmundakar@gmail.com&subject=${subject}&body=${body}`
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* <Navbar /> */}

      <div className="w-full px-4 sm:px-6 lg:px-10 py-16">
        <div className="mx-auto max-w-3xl flex flex-col gap-10">

          {/* Header */}
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-3">
              Get in touch
            </p>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
              Contact
            </h1>

            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Have a question, project idea, or just want to connect? Reach out
              through email, phone, or WhatsApp.
            </p>
          </div>

          {/* Direct Contact */}
          <div className="flex flex-col gap-4">

            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Direct Contact
            </h2>

            <div className="flex flex-wrap gap-3">

              {/* Email 1 */}
              <a
                href="mailto:m.vikash1630@gmail.com"
                className="inline-flex items-center gap-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold px-5 py-3 text-sm transition-all duration-300 hover:scale-105 active:scale-95"
              >
                📧
                m.vikash1630@gmail.com
              </a>

              {/* Email 2 */}
              <a
                href="mailto:vikashmundakar@gmail.com"
                className="inline-flex items-center gap-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-bold px-5 py-3 text-sm transition-all duration-300 hover:scale-105 active:scale-95"
              >
                📩
                vikashmundakar@gmail.com
              </a>

              {/* Phone */}
              <a
                href="tel:+919573696792"
                className="inline-flex items-center gap-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-bold px-5 py-3 text-sm transition-all duration-300 hover:scale-105 active:scale-95"
              >
                📞
                +91 9573696792
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/919573696792"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-bold px-5 py-3 text-sm transition-all duration-300 hover:scale-105 active:scale-95"
              >
                💬
                WhatsApp
              </a>

            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">
              Send a Message
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

              {/* Name */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className="text-sm font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500"
                >
                  Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/40 px-4 py-3 text-lg text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-all duration-300"
                  placeholder="Your name"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-sm font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/40 px-4 py-3 text-lg text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-all duration-300"
                  placeholder="you@example.com"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="message"
                  className="text-sm font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/40 px-4 py-3 text-lg text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-all duration-300 leading-relaxed resize-none"
                  placeholder="What's on your mind?"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="self-start rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold px-6 py-3 text-sm transition-all duration-300 hover:scale-105 active:scale-95"
              >
                ✉️ Send Message
              </button>

            </form>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Contact
