export default function About({ profile }: { profile: any }) {
  return (
    <section className="py-16 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">About</h2>
      <p className="text-gray-300 leading-8">{profile?.about}</p>
    </section>
  )
}