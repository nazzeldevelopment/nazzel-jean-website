import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Shield, Home } from "lucide-react"

export default function TermsPage() {
  // Get current date for automatic updating
  const currentDate = new Date();
  const formattedDate = new Intl.DateTimeFormat('en-PH', {
    month: 'long',
    year: 'numeric'
  }).format(currentDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      <div className="container max-w-4xl mx-auto p-4 md:p-8">
        <div className="mb-6 flex justify-between">
          <Link href="/forum">
            <Button variant="outline" className="font-semibold bg-transparent hover:bg-rose-100 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Forum
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="font-semibold bg-transparent hover:bg-rose-100 transition-colors">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>

        <Card className="shadow-2xl border-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-400 via-pink-500 to-rose-600"></div>
          <CardHeader className="text-center pb-8 pt-10">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg transform hover:scale-105 transition-transform">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-4xl font-serif font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Terms of Service
            </CardTitle>
            <p className="text-muted-foreground mt-2 font-medium">Last updated: {formattedDate}</p>
          </CardHeader>
          <CardContent className="prose prose-rose max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">1. Acceptance of Terms</h2>
              <p className="text-foreground leading-relaxed font-medium">
                By accessing and using this website and forum, you accept and agree to be bound by the terms and
                provisions of this agreement. If you do not agree to these terms, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">2. User Accounts</h2>
              <p className="text-foreground leading-relaxed font-medium mb-2">
                When creating an account, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground font-medium">
                <li>Provide accurate and complete information</li>
                <li>Be at least 13 years of age</li>
                <li>Maintain the security of your password</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">3. Forum Community Guidelines</h2>
              <p className="text-foreground leading-relaxed font-medium mb-2">
                Our forum is a space for respectful discussion. Users must follow these rules:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground font-medium">
                <li>
                  <strong>Be Respectful:</strong> Treat all members with kindness and respect. No harassment, bullying,
                  or hate speech.
                </li>
                <li>
                  <strong>No Spam:</strong> Do not post repetitive content, advertisements, or irrelevant links.
                </li>
                <li>
                  <strong>Stay On Topic:</strong> Keep discussions relevant to the category and thread topic.
                </li>
                <li>
                  <strong>No Inappropriate Content:</strong> Prohibited content includes violence, explicit material,
                  illegal activities, or harmful content.
                </li>
                <li>
                  <strong>Respect Privacy:</strong> Do not share personal information of others without consent.
                </li>
                <li>
                  <strong>No Impersonation:</strong> Do not pretend to be someone else or create fake accounts.
                </li>
                <li>
                  <strong>Report Issues:</strong> If you see rule violations, report them to moderators.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">4. Content Ownership</h2>
              <p className="text-foreground leading-relaxed font-medium">
                You retain ownership of content you post. However, by posting, you grant us a non-exclusive license to
                use, display, and distribute your content on our platform. You are responsible for ensuring you have the
                right to post any content you share.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">5. Prohibited Activities</h2>
              <p className="text-foreground leading-relaxed font-medium mb-2">Users are strictly prohibited from:</p>
              <ul className="list-disc pl-6 space-y-2 text-foreground font-medium">
                <li>Attempting to hack, disrupt, or compromise the security of the platform</li>
                <li>Using automated systems or bots without permission</li>
                <li>Collecting user data without consent</li>
                <li>Engaging in any illegal activities</li>
                <li>Circumventing account restrictions or bans</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">6. Moderation and Enforcement</h2>
              <p className="text-foreground leading-relaxed font-medium">
                We reserve the right to remove content, suspend, or terminate accounts that violate these terms. Actions
                may be taken without prior notice. Repeated violations may result in permanent bans.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">7. Disclaimer of Warranties</h2>
              <p className="text-foreground leading-relaxed font-medium">
                This service is provided "as is" without warranties of any kind. We do not guarantee uninterrupted
                access or error-free operation. Use at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">8. Limitation of Liability</h2>
              <p className="text-foreground leading-relaxed font-medium">
                We are not liable for any damages arising from your use of this service, including but not limited to
                direct, indirect, incidental, or consequential damages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">9. Changes to Terms</h2>
              <p className="text-foreground leading-relaxed font-medium">
                We reserve the right to modify these terms at any time. Continued use of the service after changes
                constitutes acceptance of the new terms. We will notify users of significant changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">10. Intellectual Property</h2>
              <p className="text-foreground leading-relaxed font-medium">
                All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of our website or its content suppliers and is protected by Philippine copyright laws (Republic Act No. 8293 or the Intellectual Property Code of the Philippines). Unauthorized use of any materials may violate copyright, trademark, and other laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">11. Governing Law</h2>
              <p className="text-foreground leading-relaxed font-medium">
                These Terms shall be governed by and construed in accordance with the laws of the Republic of the Philippines. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of the Philippines.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">12. Contact Information</h2>
              <p className="text-foreground leading-relaxed font-medium">
                If you have questions about these terms, please contact us through the forum or website contact methods. Our office is located in the Philippines, and we strive to respond to all inquiries within 48 hours.
              </p>
            </section>

            <div className="mt-8 p-6 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border-2 border-primary/20 shadow-inner">
              <p className="text-center text-foreground font-semibold">
                By using our forum, you acknowledge that you have read, understood, and agree to be bound by these Terms
                of Service.
              </p>
              <div className="flex justify-center mt-4">
                <Link href="/">
                  <Button className="bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 transition-all">
                    Return to Homepage
                  </Button>
                </Link>
              </div>
              <p className="text-center text-muted-foreground text-sm mt-6">
                © {new Date().getFullYear()} Nazzel-Jean Website. All rights reserved.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
