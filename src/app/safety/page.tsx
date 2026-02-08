'use client';

import { 
  ShieldCheckIcon, 
  ChatBubbleLeftRightIcon, 
  MapPinIcon, 
  CurrencyDollarIcon,
  UserCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PhoneIcon,
  CameraIcon
} from '@heroicons/react/24/outline';

const safetyTips = [
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Use In-App Messaging',
    description: 'Always communicate through Exchangify\'s messaging system. This creates a record of all conversations and protects you from potential scams.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: MapPinIcon,
    title: 'Meet in Public Places',
    description: 'Choose busy, well-lit locations for item exchanges. UBC campus areas like the Irving K. Barber Learning Centre or student union buildings are ideal.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: CurrencyDollarIcon,
    title: 'Secure Payment Methods',
    description: 'Prefer cash or secure in-app payments for transactions. Avoid wire transfers, gift cards, or requests for unusual payment methods.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: CameraIcon,
    title: 'Inspect Before Purchasing',
    description: 'Always examine items thoroughly before paying. Ask for additional photos if needed and test electronics before completing the transaction.',
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    icon: UserCircleIcon,
    title: 'Verify User Profiles',
    description: 'Check user ratings, reviews, and profile completeness before arranging a meetup. Look for verified badges and positive community feedback.',
    color: 'bg-indigo-100 text-indigo-600',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Trust Your Instincts',
    description: 'If something feels off, walk away. Genuine sellers will understand your caution. Report suspicious behavior to help protect the community.',
    color: 'bg-red-100 text-red-600',
  },
];

const redFlags = [
  'Requests for payment through unusual methods (gift cards, wire transfers)',
  'Refusal to meet in person or provide additional photos',
  'Urgency or pressure to complete transactions quickly',
  'Prices that seem too good to be true',
  'Requests for personal information like Social Insurance Number',
  'Multiple accounts contacting you about the same listing',
  'Vague descriptions or copied listing text',
];

const emergencySteps = [
  'End all communication immediately',
  'Block the user through the app',
  'Report the user to Exchangify support',
  'Contact campus security at 604-822-2222 for UBC-related incidents',
  'File a report with local police if money was lost',
];

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-ubc-blue to-primary rounded-2xl shadow-lg mb-6">
            <ShieldCheckIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Safe Trading Guide
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your safety is our top priority. Follow these guidelines to ensure secure and successful transactions on Exchangify.
          </p>
        </div>

        {/* Safety Tips Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
            Essential Safety Tips
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {safetyTips.map((tip, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${tip.color} mb-4`}>
                  <tip.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {tip.title}
                </h3>
                <p className="text-gray-600">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Red Flags */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <ExclamationTriangleIcon className="h-6 w-6 text-amber-500" />
            Warning Signs to Watch For
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {redFlags.map((flag, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-red-600 text-sm font-bold">×</span>
                </div>
                <p className="text-gray-700">{flag}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What to Do If Something Goes Wrong */}
        <div className="bg-red-50 rounded-xl p-6 border border-red-100 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <PhoneIcon className="h-6 w-6 text-red-600" />
            If Something Goes Wrong
          </h2>
          <div className="space-y-4">
            {emergencySteps.map((step, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <p className="text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Report Section */}
        <div className="bg-gradient-to-r from-ubc-blue/10 to-primary/10 rounded-xl p-6 border border-ubc-blue/20">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-ubc-blue rounded-xl flex items-center justify-center">
              <ShieldCheckIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Help Us Keep the Community Safe
              </h3>
              <p className="text-gray-600 mb-4">
                Encountered suspicious behavior? Report suspicious listings or users to help us maintain a safe trading environment for everyone.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="/listings/create"
                  className="inline-flex items-center gap-2 bg-ubc-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-ubc-blue/90 transition-colors"
                >
                  Report a Listing
                </a>
                <a
                  href="/profile"
                  className="inline-flex items-center gap-2 bg-white text-ubc-blue border border-ubc-blue px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Report a User
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@exchangify.com" className="text-ubc-blue hover:underline">
              support@exchangify.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
