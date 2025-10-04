import React from 'react'
import { VotingCard } from '../components/ui/VotingCard'
export default function OpenVoting() {
  const votingEvents = [
    {
      id: 1,
      title: 'Web3 Innovate Jam',
      status: 'Voting',
      description:
        'The Web3 Innovate Jam is designed to inspire developers, designers, and innovators to build innovative applications that integrate the MetaMask Card...',
      daysLeft: 8,
      techStack: 'All tech stack',
      level: 'All levels accepted',
      prize: '40,000.00 USD',
      participants: 405,
      bannerUrl:
        'https://mirrorful-production.s3.us-west-1.amazonaws.com/patterns/files/6e912808-b703-4ad2-bdf3-9274b7d3b0a6/figma-preview.png',
      eventDetails: {
        name: 'Web3 Innovate Jam',
        edition: 'AI & Blockchain Edition',
        prize: '$30,000 prize pool',
        date: 'May 10-12, 2024',
      },
    },
    {
      id: 2,
      title: 'Coindora Hackfest',
      status: 'Voting',
      description:
        'Coindora Hackfest is designed to inspire developers, designers, and innovators to build innovative applications that integrate the MetaMask Card...',
      daysLeft: 7,
      techStack: 'All tech stack',
      level: 'All levels accepted',
      prize: '1,000.00 USD',
      participants: 405,
      bannerUrl:
        'https://mirrorful-production.s3.us-west-1.amazonaws.com/patterns/files/6e912808-b703-4ad2-bdf3-9274b7d3b0a6/figma-preview.png',
      eventDetails: {
        name: 'COINDORA HACKFEST',
        edition: 'ASTRAL COSMOS CHALLENGE',
        prize: '$35,000 IN PRIZES',
        date: 'SEPTEMBER 5-8, 2024',
      },
    },
    {
      id: 3,
      title: 'Moca Network Identity',
      status: 'Live',
      description:
        'The MetaMask Card Hackathon is designed to inspire developers, designers, and innovators to build innovative applications that integrate the MetaMask...',
      daysLeft: 8,
      techStack: 'All tech stack',
      level: 'All levels accepted',
      prize: '40,000.00 USD',
      participants: 405,
      bannerUrl:
        'https://mirrorful-production.s3.us-west-1.amazonaws.com/patterns/files/6e912808-b703-4ad2-bdf3-9274b7d3b0a6/figma-preview.png',
      eventDetails: {
        name: 'MOCA NETWORK IDENTITY HOUSE',
        focus: 'Focus: Account Identity and Reputation',
        prize: 'Prize: $40,000',
        date: 'When: June 27 - July 1, 2023',
      },
    },
  ]
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Open Voting</h2>
      <div className="grid grid-cols-1 gap-4">
        {votingEvents.map((event) => (
          <VotingCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  )
}
