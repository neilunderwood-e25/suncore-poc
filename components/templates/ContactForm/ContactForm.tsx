"use client";

import { useState, type FormEvent } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      firstName: data.get("firstName") as string,
      lastName: data.get("lastName") as string,
      email: data.get("email") as string,
      phone: data.get("phone") as string,
      company: data.get("company") as string,
      jobTitle: data.get("jobTitle") as string,
      subject: data.get("subject") as string,
      message: data.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Submission failed");
      }

      setFormState("success");
      form.reset();
    } catch (err) {
      setFormState("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  }

  if (formState === "success") {
    return (
      <div className="rounded-lg border border-clover-40 bg-clover-10 p-8 text-center">
        <h3 className="mb-2 text-xl font-bold text-midnight">
          Thank you for reaching out!
        </h3>
        <p className="text-dark-grey">
          We have received your message and will get back to you shortly.
        </p>
        <button
          type="button"
          className="mt-6 cursor-pointer rounded bg-midnight px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-midnight-95"
          onClick={() => setFormState("idle")}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="firstName"
            className="mb-1 block text-sm font-semibold text-midnight"
          >
            First Name <span className="text-red">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            className="w-full rounded border border-light-grey px-3 py-2 text-sm text-dark-grey outline-none transition-colors focus:border-midnight"
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="mb-1 block text-sm font-semibold text-midnight"
          >
            Last Name <span className="text-red">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            className="w-full rounded border border-light-grey px-3 py-2 text-sm text-dark-grey outline-none transition-colors focus:border-midnight"
          />
        </div>
      </div>

      {/* Email & Phone row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-semibold text-midnight"
          >
            Email <span className="text-red">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full rounded border border-light-grey px-3 py-2 text-sm text-dark-grey outline-none transition-colors focus:border-midnight"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-1 block text-sm font-semibold text-midnight"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="w-full rounded border border-light-grey px-3 py-2 text-sm text-dark-grey outline-none transition-colors focus:border-midnight"
          />
        </div>
      </div>

      {/* Company & Job Title row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="company"
            className="mb-1 block text-sm font-semibold text-midnight"
          >
            Company
          </label>
          <input
            type="text"
            id="company"
            name="company"
            className="w-full rounded border border-light-grey px-3 py-2 text-sm text-dark-grey outline-none transition-colors focus:border-midnight"
          />
        </div>

        <div>
          <label
            htmlFor="jobTitle"
            className="mb-1 block text-sm font-semibold text-midnight"
          >
            Job Title
          </label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            className="w-full rounded border border-light-grey px-3 py-2 text-sm text-dark-grey outline-none transition-colors focus:border-midnight"
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label
          htmlFor="subject"
          className="mb-1 block text-sm font-semibold text-midnight"
        >
          Subject <span className="text-red">*</span>
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          required
          className="w-full rounded border border-light-grey px-3 py-2 text-sm text-dark-grey outline-none transition-colors focus:border-midnight"
        />
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="mb-1 block text-sm font-semibold text-midnight"
        >
          Message <span className="text-red">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full rounded border border-light-grey px-3 py-2 text-sm text-dark-grey outline-none transition-colors focus:border-midnight"
        />
      </div>

      {/* Error */}
      {formState === "error" && (
        <div className="rounded border border-red bg-red-10 px-4 py-3 text-sm text-red">
          {errorMessage}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={formState === "submitting"}
        className="rounded bg-gold px-8 py-3 text-sm font-bold text-midnight transition-colors hover:bg-gold-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {formState === "submitting" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
