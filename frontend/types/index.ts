export interface Project {

 id:string;

 title:string;

 description:string;

 imageUrl:string;

 githubUrl:string|null;

 liveUrl:string|null;

 technologies:string[];

 featured:boolean;

}


export interface Certificate {

 id:string;

 title:string;

 organization:string;

 imageUrl:string;

 credentialUrl:string|null;

}


export interface Experience {

 id:string;

 company:string;

 role:string;

 description:string;

 companyLogo:string|null;

 technologies:string[];

}


export interface Skill {

 id:string;

 name:string;

 category:string;

 level:string;

 icon:string|null;

}


export interface Showcase {

 id:string;

 title:string;

 type:"PHONE"|"LAPTOP";

 description:string;

 imageUrl:string;

 liveUrl:string|null;

 technologies:string[];

}