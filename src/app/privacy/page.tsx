import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — QRWing",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-gray-700 dark:text-gray-300">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: June 21, 2026</p>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">1. What we collect</h2>
          <p>When you sign in with Google, GitHub, or Discord, we collect:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Your name</li>
            <li>Your email address</li>
            <li>Your profile picture</li>
          </ul>
          <p className="mt-2">We do <strong>not</strong> collect any other personal data.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">2. How we use it</h2>
          <p>We use this information only to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Create and manage your account</li>
            <li>Show your profile on your dashboard</li>
            <li>Contact you about your account if necessary</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">3. Data storage</h2>
          <p>Your data is stored in a secure PostgreSQL database on Supabase, hosted in the EU (Ireland). We retain your data until you delete your account.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">4. Third-party sharing</h2>
          <p>We do <strong>not</strong> sell, trade, or share your personal data with third parties. Authentication is handled by Google, GitHub, and Discord &mdash; refer to their privacy policies for how they handle your data during the sign-in process.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">5. Cookies</h2>
          <p>We use essential session cookies to keep you logged in. No tracking, analytics, or advertising cookies are used.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">6. Your rights</h2>
          <p>You can request deletion of your account and associated data at any time by contacting us. We will respond within 30 days.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">7. Contact</h2>
          <p>For any privacy-related inquiries, contact us at: <a href="mailto:qrwing.app@gmail.com" className="text-purple-600 hover:underline">qrwing.app@gmail.com</a></p>
        </div>
      </section>
    </main>
  );
}
