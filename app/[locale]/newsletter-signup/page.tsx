import { NewsletterSignupForm } from "@/components/sections/NewsletterSignup/NewsletterSignupForm";

export const metadata = {
  title: "Sign up for Suncor Energy Inc. Press Releases",
  description:
    "Subscribe to receive press releases for Suncor Energy Inc. via email.",
};

export default function NewsletterSignupPage() {
  return (
    <>
      {/* Header placeholder */}
      <header className="sticky top-0 z-[100] w-full">
        <img src="/header.png" alt="" className="w-full" />
      </header>

      <main className="relative z-0">
        <section className="py-12 md:py-16">
          <div className="article-container">
            <div className="mx-auto max-w-xl">
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
                Sign up for Suncor Energy Inc. press releases
              </h1>

              {/* Description */}
              <p className="mb-8 text-sm leading-relaxed text-dark-grey-70">
                Complete and submit the form below to sign up and receive press
                releases for Suncor Energy Inc. via email. You can return to
                this form at any time and unsubscribe from this list, or by
                clicking on the unsubscribe options at the bottom of press
                release emails.
              </p>

              {/* Form */}
              <NewsletterSignupForm />
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
