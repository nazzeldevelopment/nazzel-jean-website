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
                explains how we collect, use, and safeguard your data when you use our website and forum.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">2. Information We Collect</h2>
              <p className="text-foreground leading-relaxed font-medium mb-2">We collect the following information:</p>
              <ul className="list-disc pl-6 space-y-2 text-foreground font-medium">
                <li>
                  <strong>Account Information:</strong> Username, email address, date of birth, and password (encrypted)
                </li>
                <li>
                  <strong>Profile Data:</strong> Any information you choose to add to your profile
                </li>
                <li>
                  <strong>Forum Content:</strong> Posts, replies, and interactions you make on the forum
                </li>
                <li>
                  <strong>Usage Data:</strong> IP address, browser type, device information, and access times
                </li>
                <li>
                  <strong>Cookies:</strong> Session data and preferences stored in your browser
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
                <li>Prevent fraud, spam, and abuse</li>
                <li>Enforce our Terms of Service and community guidelines</li>
                <li>Communicate important updates and changes</li>
              </ul>
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
                <li>Email verification to confirm account ownership</li>
                <li>Regular security updates and monitoring</li>
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
                  <strong>Service Providers:</strong> Trusted third parties who help operate our service (under strict
                  confidentiality)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">6. Your Rights and Choices</h2>
              <p className="text-foreground leading-relaxed font-medium mb-2">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-foreground font-medium">
                <li>Access and review your personal information</li>
                <li>Update or correct your account details</li>
                <li>Delete your account and associated data</li>
                <li>Opt out of non-essential communications</li>
                <li>Request a copy of your data</li>
              </ul>
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
                Our service is hosted in the Philippines. If you access our service from outside the Philippines, please be aware that your information may be transferred to, stored, and processed in the Philippines where our servers are located. By using our services, you consent to the transfer of your data to the Philippines.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">13. Contact Us</h2>
              <p className="text-foreground leading-relaxed font-medium">
                If you have questions or concerns about this Privacy Policy or how we handle your data, please contact
                us through the forum or website contact methods. We strive to respond to all privacy-related inquiries within 48 hours.
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
