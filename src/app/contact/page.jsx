import ContactForm from '@/components/ContactForm';
import SocialLinks from '@/components/SocialLinks';
import SectionHeader from '@/components/SectionHeader';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <SectionHeader 
            eyebrow="Get In Touch"
            title="Let's Work Together"
            description="Ready to bring your ideas to life? I'm here to help you build something amazing. Choose how you'd like to connect."
          />
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <div className="order-2 lg:order-1">
              <div className="bg-gray-800/30 p-8 rounded-2xl border border-gray-700 backdrop-blur-sm">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">Send a Message</h2>
                  <p className="text-gray-400">
                    Have a specific project in mind? Fill out the form below and I'll get back to you as soon as possible.
                  </p>
                </div>
                <ContactForm />
              </div>
            </div>

            {/* Social Links */}
            <div className="order-1 lg:order-2">
              <div className="bg-gray-800/30 p-8 rounded-2xl border border-gray-700 backdrop-blur-sm h-fit">
                <SocialLinks />
              </div>
            </div>
          </div>

          {/* Additional Contact Info */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-800/20 rounded-xl border border-gray-700/50">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
              <p className="text-gray-400 text-sm">Perfect for detailed project discussions</p>
            </div>

            <div className="text-center p-6 bg-gray-800/20 rounded-xl border border-gray-700/50">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Quick Chat</h3>
              <p className="text-gray-400 text-sm">For immediate questions and networking</p>
            </div>

            <div className="text-center p-6 bg-gray-800/20 rounded-xl border border-gray-700/50">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Collaboration</h3>
              <p className="text-gray-400 text-sm">Ready to build something together</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
