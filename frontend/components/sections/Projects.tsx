export default function Projects({ projects }: { projects: any[] }) {
  return (
    <section className="py-16 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Projects</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="p-6 border rounded-xl">
            <h3 className="text-xl font-semibold">{project.title}</h3>
            <p className="mt-3 text-gray-300">{project.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}