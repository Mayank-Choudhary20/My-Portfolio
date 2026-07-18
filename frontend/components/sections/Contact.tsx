export default function Contact() {
  return (
    <section className="py-16 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Contact</h2>

      <form className="space-y-4">
        <input
          className="w-full p-3 border rounded-lg bg-transparent"
          placeholder="Your Name"
        />

        <input
          className="w-full p-3 border rounded-lg bg-transparent"
          placeholder="Your Email"
        />

        <textarea
          className="w-full p-3 border rounded-lg bg-transparent"
          rows={5}
          placeholder="Your Message"
        />

        <button className="px-6 py-3 bg-blue-600 rounded-lg">
          Send Message
        </button>
      </form>
    </section>
  )
}