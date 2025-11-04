import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Code, Coins, Settings, Database, Bot, Shield } from 'lucide-react'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <div className="py-10 md:py-16 text-center">
        <div className="mb-6 flex justify-center">
          <Image
            src="/TransparentBrainOnly.png"
            alt="CogniDAO Brain Logo"
            width={180}
            height={180}
            priority
          />
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 pb-5 bg-gradient-to-r from-[hsl(var(--brain-purple))] via-[hsl(var(--accent))] to-[hsl(var(--brain-cyan))] bg-clip-text text-transparent">
          Cogni
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4">
          Community-owned. AI-powered. Open source. 
        </p>
        <div className="container mx-auto px-4 pt-8 pb-4 max-w-7xl">
          <h2 className="text-2xl font-serif font-bold mb-6 text-center">The Problem</h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4">Web3 doesn't know how to control Web2 Code</p>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4">Yet.</p>
        </div>
        <div className="container mx-auto px-4 pt-8 pb-4 max-w-7xl">
          <h2 className="text-2xl font-serif font-bold mb-6 text-center">The Goal</h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4">Launch a web3-controlled, AI-powered company with 1 click.</p>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4">Build it together with people around the world.</p>
        </div>
      </div>
      {/* GitHub Repos Section */}
      <div className="mb-12 mt-6">
        <h2 className="text-2xl font-serif font-bold mb-6 text-center">
          Our GitHub Repositories
        </h2>
        <p className="text-md md:text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
          Each repo produced by CogniDAO will be a DAO-controlled codebase. Pick an area you&rsquo;d like to contribute to. They all need help.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:border-knowledge group transition-colors duration-200">
            <CardContent className="p-6">
              <a
                href="https://github.com/Cogni-DAO/cogni-git-admin"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center block"
              >
                <div className="flex flex-col items-center mb-3">
                  <div className="bg-secondary h-16 w-16 rounded-lg flex items-center justify-center mb-3">
                    <Settings className="h-8 w-8 text-knowledge" />
                  </div>
                  <h3 className="text-lg font-medium group-hover:text-knowledge transition-colors duration-200 mb-2">
                    Git Admin App
                  </h3>
                  <Badge variant="secondary">Typscript</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  The first direct connection between a DAO and admin Git repo actions.
                </p>
              </a>
            </CardContent>
          </Card>

          <Card className="hover:border-knowledge group transition-colors duration-200">
            <CardContent className="p-6">
              <a
                href="https://github.com/Cogni-DAO/cogni-site"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center block"
              >
                <div className="flex flex-col items-center mb-3">
                  <div className="bg-secondary h-16 w-16 rounded-lg flex items-center justify-center mb-3">
                    <Code className="h-8 w-8 text-knowledge" />
                  </div>
                  <h3 className="text-lg font-medium group-hover:text-knowledge transition-colors duration-200 mb-2">
                    Cogni Site
                  </h3>
                  <Badge variant="secondary">U Are Here</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Next.js frontend application for CogniDAO&rsquo;s memory and knowledge management system.
                </p>
              </a>
            </CardContent>
          </Card>

          <Card className="hover:border-knowledge group transition-colors duration-200">
            <CardContent className="p-6">
              <a
                href="https://github.com/Cogni-DAO/cogni-git-review"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center block"
              >
                <div className="flex flex-col items-center mb-3">
                  <div className="bg-secondary h-16 w-16 rounded-lg flex items-center justify-center mb-3">
                    <Bot className="h-8 w-8 text-knowledge" />
                  </div>
                  <h3 className="text-lg font-medium group-hover:text-knowledge transition-colors duration-200 mb-2">
                    AI Code Review
                  </h3>
                  <Badge variant="secondary">Langgraph.js</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Configurable Code Review Agent that stands between your code and the DAO&rsquo;s main branch.
                </p>
              </a>
            </CardContent>
          </Card>

          <Card className="hover:border-knowledge group transition-colors duration-200">
            <CardContent className="p-6">
              <a
                href="https://github.com/Cogni-DAO/cogni-signal-evm-contracts"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center block"
              >
                <div className="flex flex-col items-center mb-3">
                  <div className="bg-secondary h-16 w-16 rounded-lg flex items-center justify-center mb-3">
                    <Coins className="h-8 w-8 text-knowledge" />
                  </div>
                  <h3 className="text-lg font-medium group-hover:text-knowledge transition-colors duration-200 mb-2">
                    EVM Smart Contract
                  </h3>
                  <Badge variant="secondary">Solidity</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  CogniSignal that the Admin app listens for, and deploy scripts for creating a new DAO.
                </p>
              </a>
            </CardContent>
          </Card>

          <Card className="hover:border-knowledge group transition-colors duration-200">
            <CardContent className="p-6">
              <a
                href="https://github.com/Cogni-DAO/CogniDAO-Memory"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center block"
              >
                <div className="flex flex-col items-center mb-3">
                  <div className="bg-secondary h-16 w-16 rounded-lg flex items-center justify-center mb-3">
                    <Database className="h-8 w-8 text-knowledge" />
                  </div>
                  <h3 className="text-lg font-medium group-hover:text-knowledge transition-colors duration-200 mb-2">
                    AI Agents + Decentralized Memory
                  </h3>
                  <Badge variant="secondary">Langgraph, Prefect, MCP, Dolt DB</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Careful, there be dragons here.
                </p>
              </a>
            </CardContent>
          </Card>
          <Card className="hover:border-knowledge group transition-colors duration-200">
            <CardContent className="p-6">
              <a
                href="https://github.com/sourcecred"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center block"
              >
                <div className="flex flex-col items-center mb-3">
                  <div className="bg-secondary h-16 w-16 rounded-lg flex items-center justify-center mb-3">
                    <Coins className="h-8 w-8 text-knowledge" />
                  </div>
                  <h3 className="text-lg font-medium group-hover:text-knowledge transition-colors duration-200 mb-2">
                    SourceCred
                  </h3>
                  <Badge variant="secondary">Typescript, probably</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Credit People for their work. SourceCred crashed 3 years ago, we need to rebuild it.
                </p>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Security Model Section */}
      <div className="mt-12">
        <div className="flex items-center space-x-3 mb-6 justify-center">
          <Shield className="h-6 w-6 text-knowledge" />
          <h2 className="text-2xl font-serif font-bold">Security Model</h2>
        </div>

        {/* Value Flow Placeholder */}
        <Card className="mb-8">
          <CardHeader>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-8 text-center border-2 border-dashed border-border">
              <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Hey where did our model go? 
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Known Issues Table */}
        <Card>
          <CardHeader>
            <CardTitle>Known Issues</CardTitle>
            <CardDescription>
              Are we an autonomous cobebase controlled by a DAO yet?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Issue</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Stability</TableCell>
                  <TableCell><Badge variant="destructive">High</Badge></TableCell>
                  <TableCell><Badge variant="secondary">Self-reflecting</Badge></TableCell>
                  <TableCell>I created 50 test DAOs this week. How long will this testnet DAO last before we redeploy?</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Git Admin Granular Permissions</TableCell>
                  <TableCell><Badge variant="destructive">High</Badge></TableCell>
                  <TableCell><Badge variant="outline">In Progress</Badge></TableCell>
                  <TableCell>Currently:1 DAO has control over all codebases the github app is installed on.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Tokenomics</TableCell>
                  <TableCell><Badge variant="secondary">Medium</Badge></TableCell>
                  <TableCell><Badge variant="secondary">Scared</Badge></TableCell>
                  <TableCell>Sourcred Weights will take a lot of trial+error. Tokenomics: will model after: Helium, Hivemapper, Akash</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Github Org Owner</TableCell>
                  <TableCell><Badge variant="secondary">Medium</Badge></TableCell>
                  <TableCell><Badge variant="outline">Identified</Badge></TableCell>
                  <TableCell>Github MUST have a person owner. Plan: Standardized Gitlab selfhosting</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="bg-secondary/60 rounded-xl p-8 text-center mt-12">
        <h2 className="text-2xl font-serif font-bold mb-4">Ready to Join the DAO?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          Well these buttons don&rsquo;t work. You want to code them?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline">Learn More</Button>
          <Button>Start Contributing</Button>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">What, no discord either? wowwww</p>
      </div>
    </div>
  )
}
