import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Code, Coins, Settings, Database, Bot, Shield, AlertTriangle } from 'lucide-react'

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
          CogniDAO
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4">
          Empowering communities to build code and data together.
        </p>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          This site, cognidao.org, is the first DAO-controlled AI run codebase
        </p>
      </div>

      {/* What We're Doing Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-serif font-bold mb-6 text-center">What We're Doing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Placeholder tiles - space for ~5 tiles */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="content-block">
              <div className="h-5 bg-muted rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-5/6 mb-2"></div>
            </div>
          ))}
        </div>
      </div>

      {/* GitHub Repos Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-serif font-bold mb-6 text-center">Our GitHub Repositories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <a
            href="https://github.com/Cogni-DAO/cogni-git-admin"
            target="_blank"
            rel="noopener noreferrer"
            className="content-block hover:border-knowledge group text-center"
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

          <a
            href="https://github.com/Cogni-DAO/cogni-site"
            target="_blank"
            rel="noopener noreferrer"
            className="content-block hover:border-knowledge group text-center"
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
              Next.js frontend application for CogniDAO's memory and knowledge management system.
            </p>
          </a>

          <a
            href="https://github.com/Cogni-DAO/cogni-git-review"
            target="_blank"
            rel="noopener noreferrer"
            className="content-block hover:border-knowledge group text-center"
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
              Configurable Code Review Agent that stands between your code and the DAO's main branch.
            </p>
          </a>

          <a
            href="https://github.com/Cogni-DAO/cogni-signal-evm-contracts"
            target="_blank"
            rel="noopener noreferrer"
            className="content-block hover:border-knowledge group text-center"
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

          <a
            href="https://github.com/Cogni-DAO/CogniDAO-Memory"
            target="_blank"
            rel="noopener noreferrer"
            className="content-block hover:border-knowledge group text-center"
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
        </div>
      </div>

      {/* Security Model Section */}
      <div className="mt-12">
        <div className="flex items-center space-x-3 mb-6 justify-center">
          <Shield className="h-6 w-6 text-knowledge" />
          <h2 className="text-2xl font-serif font-bold">Security Model</h2>
        </div>

        {/* Mermaid Diagram Placeholder */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>DAO Governance Security Architecture</CardTitle>
            <CardDescription>
              Visual representation of our security model and governance flows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-8 text-center border-2 border-dashed border-border">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Mermaid diagram placeholder - Security architecture visualization coming soon
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Known Issues Table */}
        <Card>
          <CardHeader>
            <CardTitle>Known Security Considerations</CardTitle>
            <CardDescription>
              Current security gaps and their resolution status → eventual design
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
                  <TableCell className="font-medium">Authentication Model</TableCell>
                  <TableCell><Badge variant="destructive">High</Badge></TableCell>
                  <TableCell><Badge variant="outline">Identified</Badge></TableCell>
                  <TableCell>Define comprehensive authentication and authorization framework for DAO governance</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Automated Code Review</TableCell>
                  <TableCell><Badge variant="secondary">Medium</Badge></TableCell>
                  <TableCell><Badge variant="secondary">In Progress</Badge></TableCell>
                  <TableCell>Implement automated security scanning for all contributions</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Role-Based Access Control</TableCell>
                  <TableCell><Badge variant="secondary">Medium</Badge></TableCell>
                  <TableCell><Badge variant="outline">Identified</Badge></TableCell>
                  <TableCell>Establish granular permissions for different contributor roles</TableCell>
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
          Help us build the first truly decentralized, AI-powered codebase governed by the community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline">Learn More</Button>
          <Button>Start Contributing</Button>
        </div>
      </div>
    </div>
  )
}
