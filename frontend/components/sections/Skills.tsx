export default function Skills({ skills }: { skills: any[] }) {
  return (
    <section className="py-16 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Skills</h2>

      <div className="grid md:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div key={skill.id} className="p-4 border rounded-xl">
            <h3 className="font-semibold">{skill.name}</h3>
            <p className="text-sm text-gray-400">{skill.level}</p>
          </div>
        ))}
      </div>
    </section>
  )
}