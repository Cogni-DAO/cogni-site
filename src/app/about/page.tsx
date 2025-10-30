import React from 'react'

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-serif font-bold mb-8">FAQ</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">What is Cogni?</h2>
        <p className="text-muted-foreground mb-6">
          Cogni is a member-owned, AI-first platform co-op that ships and operates automation agents for software teams, with optional DAO rails for treasury and policy.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-serif font-bold mb-6">Simple FAQ — &ldquo;Are you X?&rdquo;</h2>
        
        <div className="space-y-4">

          <div>
            <h3 className="font-semibold mb-1">Worker co-op?</h3>
            <p className="text-muted-foreground">Hopefully. CogniDAO will be forming an open source foundation, which will support the formation and coordination of worker co-ops.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-1">Platform co-op?</h3>
            <p className="text-muted-foreground">Yes. You run a digital service owned and democratically governed by participants.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-1">DAO?</h3>
            <p className="text-muted-foreground">We will be a network of DAOs, each connected to their own codebase and rules</p>
          </div>

          <div>
            <h3 className="font-semibold mb-1">Open-source foundation?</h3>
            <p className="text-muted-foreground">No. We&rsquo;re starting with open source code, but many codebases will be private.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-1">Network state?</h3>
            <p className="text-muted-foreground">No. You are not building a polity seeking recognition or territory.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-1">Accelerator?</h3>
            <p className="text-muted-foreground">No. You are not a time-boxed cohort to speed external startups.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-1">Incubator?</h3>
            <p className="text-muted-foreground">No. You are not a long-horizon idea nursery with office space.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-1">Venture studio?</h3>
            <p className="text-muted-foreground">Close. You build and launch products from a shared core for the co-op.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-1">Makerspace?</h3>
            <p className="text-muted-foreground">No. That is a physical tool lab for hands-on fabrication.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-1">Marketplace?</h3>
            <p className="text-muted-foreground">Maybe. If you let buyers book automation services, it is a co-op-run marketplace rather than a VC platform.</p>
          </div>
        </div>
      </div>

      <div className="bg-secondary/60 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-3">Bottom line</h3>
        <p>
          Cogni is a <strong>platform-cooperative automation business</strong> that can plug in DAO governance where it helps.
        </p>
      </div>
    </div>
  )
}