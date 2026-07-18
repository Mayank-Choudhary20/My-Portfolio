export interface Profile {
  id:string;
  name:string;
  title:string;
  tagline:string;
  about:string;
  email:string;
  phone:string;
  location:string;
  profileImage:string;
  github:string;
  linkedin:string;
  leetcode?:string;
  yearsExperience:number;
  available:boolean;
}


export interface Project {
  id:string;
  title:string;
  description:string;
  imageUrl:string;
  githubUrl?:string;
  liveUrl?:string;
  technologies:string[];
  featured:boolean;
}


export interface Skill {
  id:string;
  name:string;
  category:string;
  level:string;
  icon?:string;
  years?:number;
}


export interface Experience {
  id:string;
  company:string;
  role:string;
  description:string;
  technologies:string[];
}


export interface Certificate {
  id:string;
  title:string;
  organization:string;
  imageUrl:string;
  credentialUrl?:string;
}


export interface Showcase {
  id:string;
  title:string;
  type:"PHONE"|"LAPTOP";
  description:string;
  imageUrl:string;
  liveUrl?:string;
}


export interface Resume {
  id:string;
  title:string;
  fileUrl:string;
}