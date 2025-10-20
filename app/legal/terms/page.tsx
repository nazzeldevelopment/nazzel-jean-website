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
                provisions of this agreement. If you do not agree to these terms, please discontinue use immediately. These
                Terms also incorporate our Privacy Policy, Community Guidelines, and any additional policies referenced on
                the platform.
              </p>
              <p className="text-foreground leading-relaxed font-medium mt-3">
                We may update these Terms periodically to reflect changes in features, legal requirements, or community
                expectations. We will provide reasonable notice of significant changes through the forum or email. Continued
                use after changes constitutes acceptance of the updated Terms. These Terms cover the main nazzelandavionna.site
                domain as well as any subdomains, companion apps, or microsites operated under the same ownership.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">2. User Accounts</h2>
              <p className="text-foreground leading-relaxed font-medium mb-2">
                When creating an account, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground font-medium">
                <li>Provide accurate and complete registration details and keep them up to date.</li>
                <li>Be at least 13 years of age or meet the minimum age required in your jurisdiction.</li>
                <li>Maintain the confidentiality of your password and authentication credentials.</li>
                <li>Accept responsibility for all activities under your account, including posts, messages, and reactions.</li>
                <li>Notify us immediately of any unauthorized use or suspected security breaches.</li>
                <li>Not transfer, sell, or share your account with another individual without written consent.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">3. Forum Community Guidelines</h2>
              <p className="text-foreground leading-relaxed font-medium mb-2">
                Our forum is a space for respectful discussion. Users must follow these rules:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground font-medium">
                <li>
                  <strong>Be Respectful:</strong> Treat all members with kindness and respect. Harassment, bullying, hate speech,
                  or discriminatory remarks are strictly prohibited.
                </li>
                <li>
                  <strong>No Spam:</strong> Avoid repetitive content, advertisements, chain letters, or irrelevant links. Promotional
                  posts require moderator approval.
                </li>
                <li>
                  <strong>Stay On Topic:</strong> Keep discussions relevant to the category and thread topic. Use dedicated channels
                  for off-topic conversations when available.
                </li>
                <li>
                  <strong>No Inappropriate Content:</strong> Prohibited content includes explicit material, graphic violence, threats,
                  self-harm encouragement, or illegal activities.
                </li>
                <li>
                  <strong>Respect Privacy:</strong> Do not share personal information of others without explicit consent. Screenshots
                  or quotes from private conversations require permission from all parties.
                </li>
                <li>
                  <strong>No Impersonation:</strong> Do not pretend to be someone else, including moderators, administrators, or public
                  figures.
                </li>
                <li>
                  <strong>Report Issues:</strong> If you see rule violations, report them to moderators. Do not engage in public arguments
                  or vigilantism.
                </li>
                <li>
                  <strong>Moderation Decisions:</strong> Follow moderator instructions promptly. Appeals can be submitted through the
                  support channel or email.
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
                <li>Attempting to hack, disrupt, or compromise the security or availability of the platform.</li>
                <li>Using automated systems, bots, or scraping tools without prior written permission.</li>
                <li>Collecting user data, harvesting emails, or profiling other members without consent.</li>
                <li>Engaging in illegal activities, encouraging harm, or sharing instructions for wrongdoing.</li>
                <li>Circumventing account restrictions, bans, or content filters.</li>
                <li>Uploading malware, ransomware, or files that contain malicious code.</li>
                <li>Engaging in doxxing, stalking, or other privacy invasions.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">6. Moderation and Enforcement</h2>
              <p className="text-foreground leading-relaxed font-medium">
                We reserve the right to remove content, suspend, or terminate accounts that violate these terms. Actions
                may be taken without prior notice. Repeated violations may result in permanent bans. Moderator decisions
                are final; however, you may appeal by contacting us via email or support channels.
              </p>
              <p className="text-foreground leading-relaxed font-medium mt-3">
                Enforcement actions may include content removal, temporary suspensions, feature limitations, or
                permanent account termination. We may share relevant data with authorities if required by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">7. Disclaimer of Warranties</h2>
              <p className="text-foreground leading-relaxed font-medium">
                This service is provided "as is" and "as available" without warranties of any kind, whether express or implied.
                We do not guarantee uninterrupted access, error-free operation, or that defects will be corrected. Use at
                your own risk and discretion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">8. Limitation of Liability</h2>
              <p className="text-foreground leading-relaxed font-medium">
                We are not liable for any damages arising from your use of this service, including but not limited to
                direct, indirect, incidental, punitive, or consequential damages. This limitation applies even if we have been
                advised of the possibility of such damages and regardless of the theory of liability (contract, tort, negligence,
                or otherwise).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">9. Service Availability</h2>
              <p className="text-foreground leading-relaxed font-medium">
                We aim to keep the forum available at all times but may schedule maintenance, implement updates, or
                experience outages beyond our control. We are not liable for any loss incurred due to downtime, data loss,
                or interrupted access. Service features may evolve or be discontinued at our discretion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">10. Changes to Terms</h2>
              <p className="text-foreground leading-relaxed font-medium">
                We reserve the right to modify these Terms at any time. Continued use of the service after changes
                constitutes acceptance of the new terms. We will notify users of significant changes through the forum,
                email announcements, or a banner notice within the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">11. Intellectual Property</h2>
              <p className="text-foreground leading-relaxed font-medium">
                All content on this website, including but not limited to text, graphics, logos, images, and software, is the
                property of our website or its content suppliers and is protected by Philippine copyright laws (Republic Act No.
                8293 or the Intellectual Property Code of the Philippines). Unauthorized use of any materials may violate
                copyright, trademark, and other laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">12. Governing Law</h2>
              <p className="text-foreground leading-relaxed font-medium">
                These Terms shall be governed by and construed in accordance with the laws of the Republic of the Philippines.
                Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of the
                Philippines. Users outside the Philippines agree that Philippine law applies to their use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">13. Third-Party Services</h2>
              <p className="text-foreground leading-relaxed font-medium">
                Our platform may integrate third-party services (e.g., analytics, email delivery, media hosting). Those services
                may have their own terms and policies. By using the platform, you consent to the processing performed by
                these providers as necessary to deliver forum functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">14. Termination</h2>
              <p className="text-foreground leading-relaxed font-medium">
                We may suspend or terminate access to the service immediately, without prior notice or liability, for any reason
                whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the service
                will cease immediately. Provisions that by their nature should survive termination (such as intellectual property
                rights, disclaimers, and limitations of liability) will remain in effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">15. User-Generated Content Responsibility</h2>
              <p className="text-foreground leading-relaxed font-medium">
                You are solely responsible for the content you post, including ensuring it does not infringe third-party rights,
                violate laws, or contain harmful material. We reserve the right to remove or edit content that we determine in our
                sole discretion violates these Terms or is otherwise objectionable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">16. Indemnification</h2>
              <p className="text-foreground leading-relaxed font-medium">
                You agree to indemnify and hold harmless the site owners, administrators, moderators, and affiliates from any
                claims, damages, losses, liabilities, costs, or expenses (including legal fees) arising from your use of the service,
                violation of these Terms, or infringement of any third-party rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">17. Contact Information</h2>
              <p className="text-foreground leading-relaxed font-medium">
                If you have questions about these Terms, please contact us through the forum or email
                <strong> legal@nazzelandavionna.site</strong>. Our office is located in the Philippines, and we strive to respond to all
                inquiries within 48 hours.
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
