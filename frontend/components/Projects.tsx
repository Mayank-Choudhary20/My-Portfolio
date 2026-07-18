"use client";


import {useEffect,useState} from "react";
import api from "@/lib/api";
import {Project} from "@/types";


export default function Projects(){


const [projects,setProjects]=useState<Project[]>([]);



useEffect(()=>{


api.get("/projects")
.then(res=>{

setProjects(res.data)

})


},[]);



return (

<section className="p-10">


<h2 className="text-4xl font-bold mb-5">

Projects

</h2>


<div className="grid md:grid-cols-3 gap-5">


{
projects.map(project=>(


<div 
key={project.id}
className="border rounded-xl p-5"
>


<img
src={project.imageUrl}
className="rounded"
/>


<h3 className="text-xl font-bold mt-3">

{project.title}

</h3>


<p>

{project.description}

</p>


</div>


))
}


</div>


</section>


)

}