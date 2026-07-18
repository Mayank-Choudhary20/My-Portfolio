"use client";


import {useEffect,useState} from "react";
import api from "@/lib/api";
import {Experience as Exp} from "@/types";


export default function Experience(){


const [data,setData]=useState<Exp[]>([]);



useEffect(()=>{


api.get("/experience")
.then(res=>setData(res.data))


},[]);



return (

<section className="p-10">


<h2 className="text-4xl font-bold">

Experience

</h2>


{
data.map(item=>(

<div key={item.id}
className="mt-5 border p-5 rounded"
>


<h3 className="text-2xl">

{item.role}

</h3>


<p>

{item.company}

</p>


<p>

{item.description}

</p>


</div>


))
}


</section>

)

}