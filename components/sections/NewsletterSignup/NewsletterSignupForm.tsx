"use client";

import { useState, type FormEvent } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

export function NewsletterSignupForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [preference, setPreference] = useState<"subscribe" | "unsubscribe">(
    "subscribe"
  );

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
      country: data.get("country") as string,
      company: data.get("company") as string,
      subscribed: preference === "subscribe",
    };

    try {
      const res = await fetch("/api/newsletter-signup", {
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
      setPreference("subscribe");
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
          Thank you for signing up!
        </h3>
        <p className="text-dark-grey">
          You have been successfully{" "}
          {preference === "subscribe" ? "subscribed to" : "unsubscribed from"}{" "}
          Suncor Energy Inc. press releases.
        </p>
        <button
          type="button"
          className="mt-6 cursor-pointer rounded bg-midnight px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-midnight-95"
          onClick={() => setFormState("idle")}
        >
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* First Name */}
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

      {/* Last Name */}
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

      {/* Email */}
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

      {/* Country */}
      <div>
        <label
          htmlFor="country"
          className="mb-1 block text-sm font-semibold text-midnight"
        >
          Country
        </label>
        <input
          type="text"
          id="country"
          name="country"
          className="w-full rounded border border-light-grey px-3 py-2 text-sm text-dark-grey outline-none transition-colors focus:border-midnight"
        />
      </div>

      {/* Company */}
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

      {/* Subscribe / Unsubscribe radio group */}
      <div className="flex gap-8">
        <label className="flex items-center gap-2 text-sm font-semibold text-midnight">
          <input
            type="radio"
            name="preference"
            value="subscribe"
            checked={preference === "subscribe"}
            onChange={() => setPreference("subscribe")}
            className="accent-midnight"
          />
          Subscribe
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-midnight">
          <input
            type="radio"
            name="preference"
            value="unsubscribe"
            checked={preference === "unsubscribe"}
            onChange={() => setPreference("unsubscribe")}
            className="accent-midnight"
          />
          Unsubscribe
        </label>
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
        {formState === "submitting" ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
