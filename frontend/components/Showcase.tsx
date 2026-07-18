"use client";


import {useEffect,useState} from "react";
import api from "@/lib/api";
import {Showcase as Show} from "@/types";


export default function Showcase(){


const [items,setItems]=useState<Show[]>([]);



useEffect(()=>{

api.get("/showcase")
.then(res=>setItems(res.data))


},[]);



return (

<section className="p-10">


<h2 className="text-4xl font-bold">

Apps & Websites

</h2>



<div className="grid md:grid-cols-2 gap-10 mt-5">


{
items.map(item=>(


<div
key={item.id}
className="border rounded-xl p-5"
>


<h3 className="text-2xl">

{item.type}

</h3>


<img
src={item.imageUrl}
className="mt-3"
/>


<p>

{item.description}

</p>


</div>


))
}


</div>


</section>


)

}