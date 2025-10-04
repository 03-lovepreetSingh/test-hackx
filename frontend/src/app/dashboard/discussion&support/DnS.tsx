"use client"
import React, { useState } from 'react'
import {
  Search,
  MessageSquare,
  Users,
  Send,
  Plus,
  Clock,
  Heart,
  MessageCircle,
  PanelRight,
  X,
} from 'lucide-react'
export function DiscussionSupport() {
  const [activeTab, setActiveTab] = useState('forums')
  const [chatOpen, setChatOpen] = useState(false)
  const forumTopics = [
    {
      id: 1,
      title: 'Getting started with smart contracts',
      category: 'Blockchain',
      author: 'alex_blockchain',
      replies: 24,
      views: 342,
      lastActive: '2 hours ago',
    },
    {
      id: 2,
      title: 'Best practices for hackathon presentations',
      category: 'Hackathons',
      author: 'hackathon_pro',
      replies: 37,
      views: 512,
      lastActive: '4 hours ago',
    },
    {
      id: 3,
      title: 'Looking for team members for ChainSpark Hackathon',
      category: 'Team Building',
      author: 'dev_sarah',
      replies: 18,
      views: 230,
      lastActive: '12 hours ago',
    },
    {
      id: 4,
      title: 'How to optimize gas fees in DeFi protocols',
      category: 'DeFi',
      author: 'defi_wizard',
      replies: 42,
      views: 678,
      lastActive: '1 day ago',
    },
    {
      id: 5,
      title: 'Debugging Solidity contracts efficiently',
      category: 'Development',
      author: 'solidity_dev',
      replies: 15,
      views: 289,
      lastActive: '2 days ago',
    },
    {
      id: 6,
      title: 'Announcing Web3 Innovate Jam winners!',
      category: 'Announcements',
      author: 'hackx_admin',
      replies: 53,
      views: 1204,
      lastActive: '3 days ago',
      pinned: true,
    },
  ]
  const chatRooms = [
    {
      id: 1,
      name: 'Blockchain Developers',
      members: 245,
      lastMessage: 'Has anyone used Hardhat for testing?',
      active: true,
    },
    {
      id: 2,
      name: 'Web3 Innovate Jam',
      members: 187,
      lastMessage: 'Looking for a designer for our team',
      active: true,
    },
    {
      id: 3,
      name: 'DeFi Discussion',
      members: 310,
      lastMessage: 'New yield farming strategy just dropped',
      active: true,
    },
    {
      id: 4,
      name: 'Beginner Help',
      members: 423,
      lastMessage: 'How do I connect my wallet to dApps?',
      active: true,
    },
    {
      id: 5,
      name: 'HackX Announcements',
      members: 1024,
      lastMessage: 'New hackathon announced for October',
      active: true,
    },
  ]
  const messages = [
    {
      id: 1,
      author: 'alex_blockchain',
      avatar: '#472915',
      content: 'Has anyone used Hardhat for testing?',
      timestamp: '10:32 AM',
    },
    {
      id: 2,
      author: 'dev_sarah',
      avatar: '#1565c0',
      content:
        "Yes, it's great for local development and testing. Much better than Truffle in my opinion.",
      timestamp: '10:35 AM',
    },
    {
      id: 3,
      author: 'solidity_dev',
      avatar: '#4a148c',
      content:
        'I prefer Foundry these days, but Hardhat is solid. What are you trying to test?',
      timestamp: '10:38 AM',
    },
    {
      id: 4,
      author: 'alex_blockchain',
      avatar: '#472915',
      content:
        "I'm working on a new DeFi protocol for my hackathon project and need to test complex interactions between multiple contracts.",
      timestamp: '10:40 AM',
    },
    {
      id: 5,
      author: 'defi_wizard',
      avatar: '#004d40',
      content:
        "For complex interactions, Hardhat's forking capabilities are really useful. You can fork mainnet and test against live protocols.",
      timestamp: '10:42 AM',
      likes: 2,
    },
  ]
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Discussion & Support</h1>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#949fa8]" />
          <input
            type="text"
            placeholder="Search discussions..."
            className="w-full bg-[#1e1e24] border border-[#2a2a2e] rounded-md py-2 pl-10 pr-4 text-sm text-[#949fa8] focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
          />
        </div>
      </div>
      <div className="flex gap-2 border-b border-[#2a2a2e] pb-2">
        <button
          onClick={() => setActiveTab('forums')}
          className={`flex items-center px-4 py-2 rounded-md text-sm ${activeTab === 'forums' ? 'bg-[#0092ff]/10 text-[#0092ff]' : 'text-[#949fa8] hover:bg-[#1e1e24]'}`}
        >
          <MessageSquare size={16} className="mr-2" />
          Forums
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center px-4 py-2 rounded-md text-sm ${activeTab === 'chat' ? 'bg-[#0092ff]/10 text-[#0092ff]' : 'text-[#949fa8] hover:bg-[#1e1e24]'}`}
        >
          <MessageCircle size={16} className="mr-2" />
          Live Chat
        </button>
      </div>
      {activeTab === 'forums' ? (
        <div className="space-y-6">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">Popular Discussions</h2>
            <button className="bg-[#0092ff] text-white px-4 py-2 rounded-md flex items-center text-sm">
              <Plus size={16} className="mr-2" />
              New Topic
            </button>
          </div>
          <div className="overflow-hidden rounded-lg border border-[#2a2a2e]">
            <table className="w-full">
              <thead className="bg-[#1e1e24] text-[#949fa8] text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">Topic</th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-center">Replies</th>
                  <th className="px-6 py-3 text-center">Views</th>
                  <th className="px-6 py-3 text-right">Last Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2e]">
                {forumTopics.map((topic) => (
                  <tr
                    key={topic.id}
                    className="bg-[#16161b] hover:bg-[#1e1e24] cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          {topic.pinned && (
                            <span className="mr-2 text-[#0092ff]">📌</span>
                          )}
                          <span className="font-medium">{topic.title}</span>
                        </div>
                        <div className="text-xs text-[#949fa8] mt-1">
                          Posted by {topic.author}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-[#1e1e24] text-[#949fa8] text-xs px-3 py-1.5 rounded-full">
                        {topic.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm">{topic.replies}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm">{topic.views}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end text-xs text-[#949fa8]">
                        <Clock size={12} className="mr-1" />
                        {topic.lastActive}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center">
            <button className="bg-[#1e1e24] text-[#949fa8] px-4 py-2 rounded-md text-sm hover:bg-[#2a2a2e]">
              Load More Topics
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-240px)]">
          <div className="col-span-1 bg-[#16161b] border border-[#2a2a2e] rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#2a2a2e]">
              <h3 className="font-semibold">Chat Rooms</h3>
            </div>
            <div className="p-4 space-y-4 h-[calc(100%-64px)] overflow-y-auto">
              {chatRooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => setChatOpen(true)}
                  className="flex items-center p-3 rounded-lg hover:bg-[#1e1e24] cursor-pointer"
                >
                  <div className="h-10 w-10 rounded-full bg-[#0092ff]/20 flex items-center justify-center text-[#0092ff] mr-3">
                    <MessageCircle size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{room.name}</div>
                    <div className="text-xs text-[#949fa8] truncate">
                      {room.lastMessage}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center text-xs text-[#949fa8]">
                      <Users size={12} className="mr-1" />
                      {room.members}
                    </div>
                    {room.active && (
                      <div className="h-2 w-2 bg-[#4ef467] rounded-full mt-1"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {chatOpen ? (
            <div className="col-span-2 bg-[#16161b] border border-[#2a2a2e] rounded-lg overflow-hidden flex flex-col">
              <div className="p-4 border-b border-[#2a2a2e] flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Blockchain Developers</h3>
                  <div className="text-xs text-[#949fa8]">
                    245 members, 12 online
                  </div>
                </div>
                <div className="flex">
                  <button className="p-2 rounded-full hover:bg-[#2a2a2e] text-[#949fa8]">
                    <PanelRight size={16} />
                  </button>
                  <button
                    className="p-2 rounded-full hover:bg-[#2a2a2e] text-[#949fa8] ml-2"
                    onClick={() => setChatOpen(false)}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="flex">
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0"
                      style={{
                        backgroundColor: message.avatar,
                      }}
                    >
                      {message.author.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="font-medium">{message.author}</span>
                        <span className="text-xs text-[#949fa8] ml-2">
                          {message.timestamp}
                        </span>
                      </div>
                      <div className="mt-1 text-sm">{message.content}</div>
                      {message.likes && (
                        <div className="mt-1 flex items-center text-xs text-[#949fa8]">
                          <Heart size={12} className="text-pink-500 mr-1" />
                          {message.likes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-[#2a2a2e]">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 bg-[#1e1e24] border border-[#2a2a2e] rounded-l-md py-2 px-4 text-sm text-[#949fa8] focus:outline-none focus:ring-1 focus:ring-[#0092ff]"
                  />
                  <button className="bg-[#0092ff] text-white px-4 py-2 rounded-r-md">
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="col-span-2 bg-[#16161b] border border-[#2a2a2e] rounded-lg flex flex-col items-center justify-center text-center p-8">
              <MessageCircle size={48} className="text-[#949fa8] mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Chat Selected</h3>
              <p className="text-[#949fa8] mb-4">
                Select a chat room from the list to start messaging
              </p>
              <button className="bg-[#0092ff] text-white px-4 py-2 rounded-md">
                Create New Chat
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
