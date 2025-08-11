import { Button } from "@/components/ui/button"
import { Bot, FileUser, LetterText, Waypoints } from "lucide-react"
import Link from "next/link"

const AiCarreers = () => {
  return (
    <>
        <div className="text-center mb-5">
            <h3>AI Careers</h3>
            <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nostrum
            excepturi quibusdam repudiandae error dolores voluptas!
            </p>
        </div>

        <div className="mt-10">
            <div className="grid grid-cols-3 gap-5 items-center">
                <Link href={'/user/ai-careers/chat'}>
                    <div className="bg-white rounded-xl p-4 flex flex-col items-center justify-center gap-3 shadow-lg">
                        <span className="text-primary"><Bot size={70}/></span>
                        <h4>AI Career & Q/A Chat</h4>
                        <p>Lorem ipsum dolor sit amet.</p>
                        <Button variant={'default'} className="w-full">Ask Now</Button>
                    </div>
                </Link>
                <Link href={'/user/ai-careers/analyze-resume'}>
                    <div className="bg-white rounded-xl p-4 flex flex-col items-center justify-center gap-3 shadow-lg">
                        <span className="text-primary"><FileUser size={70}/></span>
                        <h4>Resume Analyze</h4>
                        <p>Lorem ipsum dolor sit amet.</p>
                        <Button variant={'default'} className="w-full">Analyze Now</Button>
                    </div>
                </Link>
                <Link href={'/user/ai-careers/ai-roadmap'}>
                    <div className="bg-white rounded-xl p-4 flex flex-col items-center justify-center gap-3 shadow-lg">
                        <span className="text-primary"><Waypoints  size={70} /></span>
                        <h4>AI Career Roadmap</h4>
                        <p>Lorem ipsum dolor sit amet.</p>
                        <Button variant={'default'} className="w-full">Get Started</Button>
                    </div>
                </Link>
                {/* <Link href={'/user/ai-careers/cover-letter'}>
                    <div className="bg-white rounded-xl p-4 flex flex-col items-center justify-center gap-3">
                        <span className="text-white"><LetterText size={70}/></span>
                        <h4>AI Cover Letter</h4>
                        <p>Lorem ipsum dolor sit amet.</p>
                        <Button variant={'default'} className="w-full">Lets Generate</Button>
                    </div>
                </Link> */}

            </div>
        </div>
    </>
  )
}

export default AiCarreers
