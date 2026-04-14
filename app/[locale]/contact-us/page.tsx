import { ContactForm } from "@/components/templates/ContactForm/ContactForm";

export const metadata = {
  title: "Contact Us | Suncor Energy",
  description:
    "Get in touch with Suncor Energy. Fill out the form below and our team will respond shortly.",
};

export default function ContactUsPage() {
  return (
    <>
      {/* Header placeholder */}
      <header className="sticky top-0 z-[100] w-full">
        <img src="/header.png" alt="" className="w-full" />
      </header>

      <main className="relative z-0">
        <section className="py-12 md:py-16">
          <div className="article-container">
            <div className="mx-auto max-w-2xl">
              {/* Suncor logo */}
              <div className="mb-8">
                <img
                  src="/assets/Suncor-logo.jpg"
                  alt="Suncor"
                  className="h-12"
                />
              </div>

              {/* Heading */}
              <h1 className="mb-4 text-2xl font-bold leading-tight text-midnight md:text-3xl">
                Contact Us
              </h1>

              {/* Description */}
              <p className="mb-8 text-sm leading-relaxed text-dark-grey-70">
                Have a question, feedback, or business inquiry? Fill out the form
                below and a member of our team will get back to you as soon as
                possible.
              </p>

              {/* Form */}
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      {/* Footer placeholder */}
      <footer>
        <img src="/footer.png" alt="" className="w-full" />
      </footer>
    </>
  );
}
