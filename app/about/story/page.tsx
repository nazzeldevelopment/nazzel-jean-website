"use client"

import { Heart, MessageCircle, Sparkles, Calendar } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { CoupleSpinnerLogo } from "@/components/couple-spinner-logo"

export default function StoryPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tl from-accent/30 to-primary/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/98 backdrop-blur-xl border-b border-border/50 shadow-xl shadow-primary/5">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <Link href="/home" className="flex items-center gap-3 group">
              <div className="relative">
                <Heart className="w-8 h-8 text-primary fill-primary animate-pulse drop-shadow-lg" />
                <Sparkles className="w-4 h-4 text-primary absolute -top-1 -right-1 animate-spin-slow" />
              </div>
              <span className="font-serif text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent drop-shadow-sm">
                N & A
              </span>
            </Link>
            <div className="flex items-center gap-10 text-sm font-extrabold tracking-wider">
              <Link href="/home" className="text-foreground hover:text-primary transition-all relative group">
                HOME
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all group-hover:w-full" />
              </Link>
              <Link href="/about/story" className="text-foreground hover:text-primary transition-all relative group">
                OUR STORY
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent scale-x-100 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Story Content */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div
            className={`space-y-20 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="text-center space-y-12">
              <div className="flex justify-center">
                <CoupleSpinnerLogo />
              </div>
              <div className="space-y-6 pt-12">
                <h1 className="font-serif text-6xl md:text-8xl text-balance font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent drop-shadow-2xl">
                  Our Love Story
                </h1>
                <p className="text-2xl md:text-4xl text-foreground/90 font-semibold drop-shadow-lg">
                  Kung paano nagsimula ang forever namin
                </p>
              </div>
            </div>

            <div className="space-y-16">
              <Card className="relative overflow-hidden border-2 border-primary/40 bg-gradient-to-br from-card via-card to-primary/10 backdrop-blur-xl shadow-2xl shadow-primary/20 hover:shadow-3xl hover:shadow-primary/30 transition-all hover:scale-[1.02] duration-500">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
                <div className="relative p-10 md:p-16 space-y-8">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-primary/30 flex items-center justify-center shadow-lg">
                      <MessageCircle className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary drop-shadow-md">
                        Chapter 1
                      </h2>
                      <p className="text-xl font-semibold text-foreground/80">Ang Simula</p>
                    </div>
                  </div>

                  <div className="space-y-5 text-lg md:text-xl leading-relaxed font-medium text-foreground">
                    <p>
                      Lahat ng magagandang kwento ay may simpleng simula. Para sa amin, nagsimula ito sa isang group
                      chat na tinatawag na <span className="font-extrabold text-primary text-2xl">"One Love GC"</span>.
                    </p>
                    <p>
                      Doon kami unang nag-usap. Random chats, tawanan, at mga kwentuhan na hindi mo aakalain na magiging
                      dahilan kung bakit magbabago ang buhay mo. Walang special, walang drama — just pure, genuine
                      connection.
                    </p>
                    <p className="text-2xl md:text-3xl font-serif italic font-bold text-primary pt-6 drop-shadow-lg">
                      "Sometimes the best love stories start with a simple hello."
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="relative overflow-hidden border-2 border-accent/40 bg-gradient-to-br from-card via-card to-accent/10 backdrop-blur-xl shadow-2xl shadow-accent/20 hover:shadow-3xl hover:shadow-accent/30 transition-all hover:scale-[1.02] duration-500">
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />
                <div className="relative p-10 md:p-16 space-y-8">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-accent/30 flex items-center justify-center shadow-lg">
                      <Sparkles className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-4xl md:text-5xl font-serif font-bold text-accent drop-shadow-md">
                        Chapter 2
                      </h2>
                      <p className="text-xl font-semibold text-foreground/80">Ang Pagkilala</p>
                    </div>
                  </div>

                  <div className="space-y-5 text-lg md:text-xl leading-relaxed font-medium text-foreground">
                    <p>
                      Habang tumatagal ang aming pag-uusap, naramdaman ko na iba siya. Hindi lang basta chat buddy o
                      kaibigan — may something special. Yung tipong excited ka na mag-reply, yung tipong ngingiti ka
                      kahit wala kang dahilan.
                    </p>
                    <p>
                      Yung tawanan namin? Walang kapantay. Yung mga kwento niya? Gustong-gusto kong pakinggan. At doon
                      ko naramdaman —{" "}
                      <span className="font-extrabold text-accent text-2xl">
                        gusto ko siyang makilala nang mas malalim
                      </span>
                      .
                    </p>
                    <p className="text-2xl md:text-3xl font-serif italic font-bold text-accent pt-6 drop-shadow-lg">
                      "Laughter is the shortest distance between two hearts."
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="relative overflow-hidden border-2 border-primary/40 bg-gradient-to-br from-card via-card to-primary/10 backdrop-blur-xl shadow-2xl shadow-primary/20 hover:shadow-3xl hover:shadow-primary/30 transition-all hover:scale-[1.02] duration-500">
                <div className="absolute top-0 left-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
                <div className="relative p-10 md:p-16 space-y-8">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-primary/30 flex items-center justify-center shadow-lg">
                      <Heart className="w-8 h-8 text-primary fill-primary" />
                    </div>
                    <div>
                      <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary drop-shadow-md">
                        Chapter 3
                      </h2>
                      <p className="text-xl font-semibold text-foreground/80">Ang Panliligaw</p>
                    </div>
                  </div>

                  <div className="space-y-5 text-lg md:text-xl leading-relaxed font-medium text-foreground">
                    <p>
                      Kaya naman, kinuha ko ang lakas ng loob. Hindi madali, pero alam kong worth it siya. Niligawan ko
                      si Avionna — hindi dahil gusto ko lang ng girlfriend, kundi dahil nakita ko na siya yung taong
                      gusto kong kasama habambuhay.
                    </p>
                    <p>
                      Every message, every effort, every moment — lahat yun para sa kanya. At alam mo yung best part?{" "}
                      <span className="font-extrabold text-primary text-2xl">Sumagot siya ng "yes"</span>.
                    </p>
                    <p className="text-2xl md:text-3xl font-serif italic font-bold text-primary pt-6 drop-shadow-lg">
                      "The best decision I ever made was choosing to love you."
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="relative overflow-hidden border-4 border-accent/50 bg-gradient-to-br from-card via-accent/5 to-primary/5 backdrop-blur-xl shadow-3xl shadow-primary/30 hover:shadow-4xl hover:shadow-accent/40 transition-all hover:scale-[1.02] duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
                <div className="relative p-10 md:p-16 space-y-8">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent drop-shadow-md">
                        Chapter 4
                      </h2>
                      <p className="text-xl font-semibold text-foreground/80">Ang Umpisa ng Forever</p>
                    </div>
                  </div>

                  <div className="space-y-5 text-lg md:text-xl leading-relaxed font-medium text-foreground">
                    <div className="flex items-center justify-center py-10">
                      <div className="text-center space-y-3">
                        <p className="text-7xl md:text-9xl font-serif font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent drop-shadow-2xl">
                          September 25
                        </p>
                        <p className="text-2xl font-semibold text-foreground/80">The day everything changed</p>
                      </div>
                    </div>
                    <p>
                      Ang petsa na ito ay hindi lang basta araw sa kalendaryo. Ito ang araw na naging kami — ang araw na
                      nagsimula ang aming forever. Mula sa simpleng chat sa "One Love GC", hanggang sa maging tayo.
                    </p>
                    <p>
                      <span className="font-extrabold text-primary text-2xl">Nazzel</span> at{" "}
                      <span className="font-extrabold text-accent text-2xl">Avionna</span> — dalawang tao na nagtagpo sa
                      tamang oras, sa tamang lugar, at sa tamang dahilan.
                    </p>
                    <p className="text-3xl md:text-4xl font-serif italic font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent pt-8 text-center drop-shadow-lg">
                      "And from that day forward, we became each other's home."
                    </p>
                  </div>
                </div>
              </Card>

              <div className="text-center space-y-10 pt-16">
                <div className="flex justify-center gap-4">
                  <Heart className="w-12 h-12 text-primary fill-primary animate-pulse drop-shadow-2xl" />
                  <Heart className="w-12 h-12 text-accent fill-accent animate-pulse animation-delay-300 drop-shadow-2xl" />
                  <Heart className="w-12 h-12 text-primary fill-primary animate-pulse animation-delay-500 drop-shadow-2xl" />
                </div>
                <p className="text-3xl md:text-5xl font-serif font-bold text-balance leading-relaxed text-foreground">
                  Ito ang kwento namin. Simple, pero totoo. Walang perfect, pero puno ng pagmamahal.
                </p>
                <p className="text-2xl md:text-3xl font-semibold text-foreground/90">
                  At ang pinakamagandang parte? Simula pa lang ito.
                </p>
                <div className="pt-16">
                  <Link
                    href="/home"
                    className="inline-flex items-center gap-4 bg-gradient-to-r from-primary via-accent to-primary text-white px-12 py-6 rounded-full text-2xl font-extrabold hover:shadow-2xl hover:shadow-primary/40 transition-all hover:scale-110 hover:-translate-y-2 shadow-xl shadow-primary/30 duration-300 drop-shadow-lg"
                  >
                    Back to Home
                    <Heart className="w-7 h-7 fill-current animate-pulse" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
