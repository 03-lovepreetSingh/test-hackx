import React from 'react'
import  ActiveProjects  from './ActiveProjects'
import  RegisteredHackathons  from './RegisteredHackathons'
import  OpenVoting  from './OpenVoting'
export default function Dashboard() {
  return (
    <div className="space-y-10">
      <ActiveProjects />
      <RegisteredHackathons />
      <OpenVoting />
    </div>
  )
}
