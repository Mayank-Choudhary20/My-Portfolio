export default function Certificates({ certificates }: { certificates: any[] }) {
  return (
    <section className="py-16 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Certificates</h2>

      <div className="grid md:grid-cols-2 gap-4">
        {certificates.map((cert) => (
          <div key={cert.id} className="p-4 border rounded-xl">
            <h3 className="font-semibold">{cert.title}</h3>
            <p className="text-sm text-gray-400">{cert.organization}</p>
          </div>
        ))}
      </div>
    </section>
  )
}