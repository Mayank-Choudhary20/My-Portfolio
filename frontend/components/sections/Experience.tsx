export default function Experience({ experience }: { experience: any[] }) {
  return (
    <section className="py-16 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Experience</h2>

      {experience.map((exp) => (
        <div key={exp.id} className="mb-8 p-6 border rounded-xl">
          <h3 className="text-xl font-semibold">{exp.role}</h3>
          <p className="text-gray-400">{exp.company}</p>
          <p className="mt-4">{exp.description}</p>
        </div>
      ))}
    </section>
  )
}