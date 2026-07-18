import api from "@/lib/api";


async function getData() {

  try {

    const [
      profile,
      projects,
      skills,
      certificates,
      experience,
      showcase,
      resume
    ] = await Promise.all([
      api.get("/profile"),
      api.get("/projects"),
      api.get("/skills"),
      api.get("/certificates"),
      api.get("/experience"),
      api.get("/showcase"),
      api.get("/resume"),
    ]);


    return {
      profile: profile.data,
      projects: projects.data,
      skills: skills.data,
      certificates: certificates.data,
      experience: experience.data,
      showcase: showcase.data,
      resume: resume.data,
    };


  } catch(error:any){

    console.log(
      "API ERROR:",
      error.response?.data || error.message
    );

    return {
      profile:null,
      projects:[],
      skills:[],
      certificates:[],
      experience:[],
      showcase:[],
      resume:null,
    };

  }

}



export default async function Home(){

const data=await getData();


return (

<main>


<h1>
{data.profile.name}
</h1>


<h2>
{data.profile.title}
</h2>


<p>
{data.profile.tagline}
</p>


<hr/>


<h2>
Projects
</h2>


{
data.projects.map((project:any)=>(

<div key={project.id}>

<h3>
{project.title}
</h3>

<p>
{project.description}
</p>


</div>

))
}



<hr/>


<h2>
Experience
</h2>


{
data.experience.map((exp:any)=>(

<div key={exp.id}>

<h3>
{exp.role}
</h3>

<p>
{exp.company}
</p>

<p>
{exp.description}
</p>

</div>

))
}




<hr/>


<h2>
Skills
</h2>


{
data.skills.map((skill:any)=>(

<p key={skill.id}>
{skill.name} - {skill.level}
</p>

))
}





<hr/>


<h2>
Certificates
</h2>


{
data.certificates.map((c:any)=>(

<p key={c.id}>
{c.title}
</p>

))
}





<hr/>


<h2>
Apps & Websites
</h2>


{
data.showcase.map((item:any)=>(

<div key={item.id}>

<h3>
{item.type}
</h3>

<p>
{item.title}
</p>

</div>

))
}





<hr/>


<a href={data.resume.fileUrl}>
Download Resume
</a>



</main>

)

}
