
import Link from "next/link";
import { ArrowRight, Plus, Rocket, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/layout/UserMenu";
import { DashboardFlowList } from "@/components/dashboard/DashboardFlowList";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <Rocket className="h-6 w-6" />
            <span>FlowBuilder</span>
          </div>
          <nav className="flex items-center gap-4">
            <UserMenu />
          </nav>
        </div>
      </header>
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Signup Flow Builder</h1>
            <p className="text-muted-foreground">
              Visual editor for Typing.com signup flows
            </p>
          </div>
        </div>

        {/* Dynamic Saved Flows Section */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            Your Saved Flows
            <span className="text-xs font-normal text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-full">
              Database
            </span>
          </h2>
          <DashboardFlowList />
        </section>

        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-xl font-semibold">Start from Template</h2>
          <span className="text-xs font-normal text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-full">
            Blueprints
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <section>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Educator</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Lead to Teacher Portal
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/editor/educator-teacher"
                  className="block p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <span className="font-medium">Teacher Flow</span>
                  <span className="block text-sm text-muted-foreground">
                    Classroom management focus
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/editor/educator-school-admin"
                  className="block p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <span className="font-medium">School Admin Flow</span>
                  <span className="block text-sm text-muted-foreground">
                    Risk management & data retention
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/editor/educator-district-admin"
                  className="block p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <span className="font-medium">District Admin Flow</span>
                  <span className="block text-sm text-muted-foreground">
                    Compliance & oversight
                  </span>
                </Link>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Individual</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Lead to Student Portal
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/editor/individual-student"
                  className="block p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <span className="font-medium">Student Flow</span>
                  <span className="block text-sm text-muted-foreground">
                    Non-classroom learners
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/editor/individual-parent"
                  className="block p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <span className="font-medium">Parent Flow</span>
                  <span className="block text-sm text-muted-foreground">
                    Homeschool & parent setup
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/editor/individual-adult"
                  className="block p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <span className="font-medium">Adult Flow</span>
                  <span className="block text-sm text-muted-foreground">
                    Professional learners
                  </span>
                </Link>
              </li>
            </ul>
          </section>
        </div>

        <div className="mt-8 pt-8 border-t">
          <Link
            href="/editor/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <span>+ Create New Flow</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
