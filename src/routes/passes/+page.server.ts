import { events } from "$lib/components/Events";
import type { FalakPass } from "$lib/components/FalakPass";



export function load(){
    return ({passes:passes});
}

const passes:FalakPass[]=[
    {
        name:"PLATINUM",
        description:"Join us for the Hackathon at TechSolstice, a high-energy, 24-hour coding marathon where your ideas take shape and your skills shine!",
        price:"1000"
    },
    {
        name:"GOLD",
        description:"Put your problem-solving skills to the test in this intense 3-hour coding contest designed to challenge the best minds in competitive programming.",
        price:"1000"
    },
    {
        name:"SILVER",
        description:"Create AI-powered solutions to real-world challenges. Showcase your innovation and compete to win the title of the best AI project.",
        price:"1000"
    },
    {
        name:"BASIC",
        description:"Form a team, build a robot, and put it to the test in challenges that measure speed, agility, and problem-solving.",
        price:"1000"
    }
]

