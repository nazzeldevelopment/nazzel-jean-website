import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Lock, Home } from "lucide-react"

export default function PrivacyPage() {
  // Get current date for automatic updating
  const currentDate = new Date();
  const formattedDate = new Intl.DateTimeFormat('en-US', {
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
              <Lock className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-4xl font-serif font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Privacy Policy
            </CardTitle>
            <p className="text-muted-foreground mt-2 font-medium">Last updated: {formattedDate}</p>
          </CardHeader>
          <CardContent className="prose prose-rose max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">1. Introduction</h2>
              <p className="text-foreground leading-relaxed font-medium">
                We respect your privacy and are committed to protecting your personal information. This Privacy Policy
                explains how we collect, use, and safeguard your data when you use our website and forum. It also outlines
                the choices you have regarding your data and our compliance with Philippine laws, including Republic Act
                No. 10173 (Data Privacy Act of 2012).
              </p>
              <p className="text-foreground leading-relaxed font-medium mt-3">
                By creating an account, continuing to browse, or participating in forum activities, you acknowledge that you
                have read and understood this Privacy Policy. We encourage you to review this document regularly to stay
                informed about how we protect your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">2. Information We Collect</h2>
              <p className="text-foreground leading-relaxed font-medium mb-2">We collect information in the following categories:</p>
              <ul className="list-disc pl-6 space-y-2 text-foreground font-medium">
                <li>
                  <strong>Account Information:</strong> Username, email address, date of birth, password (encrypted), account
                  status, and verification records.
                </li>
                <li>
                  <strong>Profile Data:</strong> Details you optionally add such as biography, location, profile photos, or
                  pronouns.
                </li>
                <li>
                  <strong>Forum Content:</strong> Posts, replies, message reactions, polls, media uploads, and metadata related
                  to your interactions.
                </li>
                <li>
                  <strong>Usage & Device Data:</strong> IP address, browser type, device identifiers, operating system,
                  timestamps, referring URLs, and performance diagnostics that help us maintain service reliability.
                </li>
                <li>
                  <strong>Cookies & Local Storage:</strong> Session data, login tokens, theme preferences, and other settings you
                  configure to personalize your experience.
                </li>
                <li>
                  <strong>Voluntary Submissions:</strong> Feedback forms, survey responses, support tickets, or testimonials you
                  choose to share with us.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">3. How We Use Your Information</h2>
              <p className="text-foreground leading-relaxed font-medium mb-2">Your information is used to:</p>
              <ul className="list-disc pl-6 space-y-2 text-foreground font-medium">
                <li>Create and manage your account</li>
                <li>Provide access to forum features and discussions</li>
                <li>Send verification codes and password reset emails</li>
                <li>Improve our services and user experience</li>
                <li>Prevent fraud, spam, and abuse using automated and manual review tools</li>
                <li>Enforce our Terms of Service, community guidelines, and safety policies</li>
                <li>Communicate important updates, policy changes, account alerts, or feature announcements</li>
                <li>Produce aggregated analytics to understand usage trends (without identifying individuals)</li>
              </ul>
              <p className="text-foreground leading-relaxed font-medium mt-3">
                We process your data only when we have a lawful basis to do so, such as your consent, performance of a
                contract, compliance with legal obligations, or legitimate interests that do not override your rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">4. Data Security</h2>
              <p className="text-foreground leading-relaxed font-medium mb-2">
                We implement security measures to protect your data:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground font-medium">
                <li>Passwords are encrypted using industry-standard hashing</li>
                <li>Account lockout protection after failed login attempts</li>
                <li>Secure session management with token-based authentication</li>
                <li>Email verification and optional multi-factor checks to confirm account ownership</li>
                <li>Regular security updates, infrastructure monitoring, and vulnerability assessments</li>
              </ul>
              <p className="text-foreground leading-relaxed font-medium mt-3">
                However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute
                security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">5. Data Sharing and Disclosure</h2>
              <p className="text-foreground leading-relaxed font-medium mb-2">
                We do not sell your personal information. We may share data only in these cases:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground font-medium">
                <li>
                  <strong>Public Forum Content:</strong> Posts and replies you make are visible to other users
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law or to protect rights and safety
                </li>
                <li>
                  <strong>Service Providers:</strong> Trusted partners (e.g., hosting, analytics, email delivery) who help us
                  operate the service under strict contractual confidentiality obligations.
                </li>
                <li>
                  <strong>Business Transfers:</strong> In the event of a merger, acquisition, or asset sale, where your data
                  may be transferred subject to this Privacy Policy.
                </li>
              </ul>
              <p className="text-foreground leading-relaxed font-medium mt-3">
                We do not sell personal information. Any third-party processing is limited to the purposes described and is
                governed by data processing agreements where required.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">6. Your Rights and Choices</h2>
              <p className="text-foreground leading-relaxed font-medium mb-2">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-foreground font-medium">
                <li>Access and review your personal information</li>
                <li>Update or correct your account details</li>
                <li>Delete your account and associated data</li>
                <li>Opt out of non-essential communications</li>
                <li>Request a copy of your data in a portable format</li>
                <li>Withdraw your consent for optional processing activities at any time</li>
              </ul>
              <p className="text-foreground leading-relaxed font-medium mt-3">
                To exercise these rights, submit a request through the forum contact form or email us at
                <strong> privacy@nazzelandavionna.site</strong>. We may ask you to verify your identity before fulfilling requests
                to protect your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">7. Age Requirements</h2>
              <p className="text-foreground leading-relaxed font-medium">
                Our service is intended for users aged 13 and above. We verify age during registration and do not
                knowingly collect information from children under 13. If we discover such data, we will delete it
                promptly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-serif text-foreground mb-3">8. Cookies and Tracking</h2>
              <p className="text-foreground leading-relaxed font-medium">
                We use cookies and local storage to maintain your session, remember preferences, and improve
                functionality. You can control cookies through your browser settings, but some features may not work
                properly without them.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">9. Data Retention</h2>
              <p className="text-foreground leading-relaxed font-medium">
                We retain your data as long as your account is active or as needed to provide services. When you delete
                your account, we will remove your personal information, though some data may be retained for legal or
                security purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">10. Changes to Privacy Policy</h2>
              <p className="text-foreground leading-relaxed font-medium">
                We may update this Privacy Policy periodically. We will notify users of significant changes through the
                forum or email. Continued use after changes indicates acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">11. Philippines Data Privacy Act Compliance</h2>
              <p className="text-foreground leading-relaxed font-medium">
                Our service complies with Republic Act No. 10173, also known as the Data Privacy Act of 2012 of the Philippines. This law protects individuals from unauthorized processing of personal information. As a user, you have the right to be informed, access your data, object to processing, rectify errors, and request the suspension or withdrawal of your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">12. International Data Transfers</h2>
              <p className="text-foreground leading-relaxed font-medium">
                Our service is hosted in the Philippines. If you access the service from outside the Philippines, please be aware
                that your information may be transferred to, stored, and processed in the Philippines where our servers are
                located. By using our services, you consent to the transfer of your data to the Philippines and acknowledge that
                local data protection laws may differ from those in your jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">13. Contact Us</h2>
              <p className="text-foreground leading-relaxed font-medium">
                If you have questions or concerns about this Privacy Policy or how we handle your data, please contact us through
                the forum or send an email to <strong>privacy@nazzelandavionna.site</strong>. Our Data Protection Officer (DPO)
                responds to privacy-related inquiries within 48 hours whenever possible.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">14. Third-Party Links and Integrations</h2>
              <p className="text-foreground leading-relaxed font-medium">
                Our website may include links to third-party sites or embed content (such as videos or external articles). We are
                not responsible for the privacy practices of these external services. We recommend reviewing the privacy
                policies of any third-party sites you visit through our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">15. Data Subject Requests</h2>
              <p className="text-foreground leading-relaxed font-medium">
                When we receive a rights request, we acknowledge it within 72 hours and aim to fulfill it within 30 days. For
                complex or high-volume requests, we may extend this period by an additional 15 days and will notify you of the
                reason for the delay. Requests that are unfounded or excessive may be limited or denied in accordance with the
                Data Privacy Act of 2012.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">16. Retention and Deletion</h2>
              <p className="text-foreground leading-relaxed font-medium">
                Personal data is retained only for as long as necessary to provide our services, comply with legal obligations, or
                resolve disputes. Backup archives may temporarily retain your information before being purged on a scheduled
                basis. If you request deletion, we will remove or anonymize your personal data within 30 days unless retention is
                legally required.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">17. Policy Updates</h2>
              <p className="text-foreground leading-relaxed font-medium">
                We may update this Privacy Policy to reflect changes in our practices or for legal, regulatory, or operational
                reasons. Significant updates will be announced through the forum and, when appropriate, via email. The
                "Last updated" date at the top of this page indicates the latest revision. Continued use of our services after any
                update constitutes acceptance of the revised policy.
              </p>
            </section>

            <div className="mt-8 p-6 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border-2 border-primary/20 shadow-inner">
              <p className="text-center text-foreground font-semibold">
                By using our service, you acknowledge that you have read and understood this Privacy Policy and consent
                to our data practices.
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
