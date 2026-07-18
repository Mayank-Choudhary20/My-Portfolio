export default function Showcase({ showcase }: { showcase: any[] }) {
  return (
    <section className="py-16 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Apps & Websites</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {showcase.map((item) => (
          <div key={item.id} className="p-6 border rounded-xl">
            <div className="text-sm text-blue-400 font-semibold">{item.type}</div>
            <h3 className="text-xl font-semibold mt-2">{item.title}</h3>
            <p className="mt-3 text-gray-300">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}