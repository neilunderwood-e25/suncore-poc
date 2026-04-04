export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-semibold text-zinc-900">Page not found</h1>
      <p className="mt-3 text-base text-zinc-600">
        This page is missing or unpublished. Double-check your Contentful slug.
      </p>
    </main>
  );
}
