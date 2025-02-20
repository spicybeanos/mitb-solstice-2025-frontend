import type { DateTime } from "@auth/core/providers/kakao";
import type { SolsticeEventInfo } from "./backend/BackendAgentEvent";

export interface SolsticeEvent {
    img_alt:string;
    name: string;
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    duration: number;
    venue: string;
    category:string;
    teamSize: number;
    pictureURL: string;
}
export function toSolsticeEvents(events:SolsticeEventInfo[]) : SolsticeEvent[] {
    let ret:SolsticeEvent[] = []
    events.forEach(e => {
        ret.push(toSolsticeEvent(e));
    });

    return ret;
}
export function toSolsticeEvent(event:SolsticeEventInfo) : SolsticeEvent {
    return {
        img_alt:'',
        name:event.name,
        id:event.id,
        title:event.name,
        description:event.description,
        date:event.start,
        time:event.start,
        teamSize:event.team_members,
        pictureURL:'',
        venue:event.venue,
        category:event.type
    } as SolsticeEvent;
}

export const placeholderEvents : SolsticeEvent[] = [
    {
        img_alt: "image alt",
        name: 'HackFest25',
        id: 'hack',
        title: 'HackFest 2025: Innovate, Code, and Create',
        description: 'Are you ready to push the boundaries of innovation and creativity? Join us for the Hackathon at TechSolstice, a high-energy, 24-hour coding marathon where your ideas take shape and your skills shine!',
        date: '16th February, 2025',
        time: '0900',
        duration: 24,
        teamSize: 4,
        pictureURL: 'https://i2.wp.com/img1.wsimg.com/isteam/ip/863482dd-338f-4fde-80d0-f2ee62329385/Wikimania_hackathon_2.JPG/:/rs=w:1240,h:620,cg:true,m/cr=w:1240,h:620',
        venue: '',
        category: ''
    },
    {
        img_alt: "image alt",
        name: 'CodeSprint25',
        id: 'code',
        title: 'CodeSprint: Crack the Code Challenge',
        description: 'Put your problem-solving skills to the test in this intense 3-hour coding contest designed to challenge the best minds in competitive programming.',
        date: '17th February, 2025',
        time: '1400',
        duration: 3,
        teamSize: 1,
        pictureURL: 'https://codesprint.lk/images/legacy/CodeSprint5.webp   ',
        venue: '',
        category: ''
    },
    {
        img_alt: "image alt",
        name: 'AI Showcase',
        id: 'ai',
        title: 'AI Showcase: Building the Future',
        description: 'Create AI-powered solutions to real-world challenges. Showcase your innovation and compete to win the title of the best AI project.',
        date: '18th February, 2025',
        time: '1000',
        duration: 8,
        teamSize: 3,
        pictureURL: 'https://img.freepik.com/premium-photo/ai-robotics-prototype-showcase_839035-95198.jpg',
        venue: '',
        category: ''
    },
    {
        img_alt: "image alt",
        name: 'Robotics Arena',
        id: 'robotics',
        title: 'Robotics Arena: Design, Build, and Compete',
        description: 'Form a team, build a robot, and put it to the test in challenges that measure speed, agility, and problem-solving.',
        date: '19th February, 2025',
        time: '1200',
        duration: 6,
        teamSize: 5,
        pictureURL: 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fmedia.oregonlive.com%2Fent_impact_tvfilm%2Fphoto%2Frobot-combat-leaguejpg-bcf961a1b15ec07a.jpg&f=1&nofb=1&ipt=b2ee1cb2c271c56a90d461aa8c8b7c8255432bc483fec697dfdfdfab62a65edb&ipo=images',
        venue: '',
        category: ''
    },
    {
        img_alt: "image alt",
        name: 'GameJam25',
        id: 'game',
        title: 'GameJam: Create the Next Hit Game',
        description: 'Bring your creative ideas to life by designing and developing a game from scratch within 24 hours. Innovate and entertain!',
        date: '20th February, 2025',
        time: '0900',
        duration: 24,
        teamSize: 4,
        pictureURL: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic0.gamerantimages.com%2Fwordpress%2Fwp-content%2Fuploads%2F2023%2F01%2Fgmtk-game-jam.jpg&f=1&nofb=1&ipt=a628bf2979382d61f959155a007dc6ebea10828b69cc14cca0c206e6c163c6e7&ipo=images',
        venue: '',
        category: ''
    },
    {
        img_alt: "image alt",
        name: 'Pitch Perfect',
        id: 'pitch',
        title: 'Pitch Perfect: The Startup Idea Competition',
        description: 'Have a startup idea? Present it to a panel of judges, and get a chance to win funding and mentorship for your venture.',
        date: '21st February, 2025',
        time: '1500',
        duration: 3,
        teamSize: 2,
        pictureURL: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fres.cloudinary.com%2Fstartup-grind%2Fimage%2Fupload%2Fc_fill%2Cdpr_2.0%2Cf_auto%2Cg_center%2Ch_540%2Cq_100%2Cw_1080%2Fv1%2Fgcs%2Fplatform-data-startupgrind%2Fblog%2FHow%252520to%252520Deal%252520with%252520Competition%252520as%252520a%252520Startup%252520Business_W7ewNJg.jpg&f=1&nofb=1&ipt=bbcd10eff9f19e863b351b9f1cffb4ba9bf023a936db0b317dfc8018a7c84592&ipo=images',
        venue: '',
        category: ''
    },
    {
        img_alt: "image alt",
        name: 'TechTrivia',
        id: 'trivia',
        title: 'TechTrivia: The Ultimate Quiz Show',
        description: 'Compete in this fast-paced quiz covering tech history, coding, and futuristic innovations. Do you have what it takes to win?',
        date: '22nd February, 2025',
        time: '1100',
        duration: 2,
        teamSize: 2,
        pictureURL: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.coolmathgameskids.com%2Fmobile%2Fwp-content%2Fuploads%2FTrivia-Quiz.jpeg&f=1&nofb=1&ipt=3a310094680fd9e34cf31463f490cf3a8792afbbf90a3a288f6108423d91683f&ipo=images',
        venue: '',
        category: ''
    },
    {
        img_alt: "image alt",
        name: 'Designathon',
        id: 'design',
        title: 'Designathon: Creativity Meets Functionality',
        description: 'Unleash your creativity in this UX/UI design competition where functionality and aesthetics collide.',
        date: '23rd February, 2025',
        time: '1300',
        duration: 5,
        teamSize: 2,
        pictureURL: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Ffree-vector%2Fdesign-process-concept-landing-page_23-2148313670.jpg&f=1&nofb=1&ipt=5dcead95307e2ab384d73c65a7e618589bb375bc80521c26573aba6ab66fd8c9&ipo=images',
        venue: '',
        category: ''
    },
    {
        img_alt: "image alt",
        name: 'CyberSecure',
        id: 'cyber',
        title: 'CyberSecure: The Ethical Hacking Challenge',
        description: 'Showcase your cybersecurity skills by solving vulnerabilities and protecting systems in this ethical hacking competition.',
        date: '24th February, 2025',
        time: '1000',
        duration: 6,
        teamSize: 3,
        pictureURL: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fgreatlakescomputer.com%2Fwp-content%2Fuploads%2F2019%2F02%2Fbigstock-Hacker-Using-Laptop-With-Binar-257453926.jpg&f=1&nofb=1&ipt=96565f2322428e9c35feb48f20450a3b515f54f9d4fa8a004bfb14b6081dc4b7&ipo=images',
        venue: '',
        category: ''
    }
];