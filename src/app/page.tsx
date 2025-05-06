import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import ClerkDebug from "./clerk-debug";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from "@clerk/nextjs";

// Define component types
type ButtonProps = {
  children: React.ReactNode;
  mode?: 'modal' | 'redirect';
  [key: string]: any;
};

type UserButtonProps = {
  afterSignOutUrl?: string;
  [key: string]: any;
};

type SignedProps = {
  children: React.ReactNode;
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">Purchase Manager</h1>
          </div>
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button>Get Started</Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="flex-1 flex items-center">
        <div className="container mx-auto grid md:grid-cols-2 gap-8 py-12">
          <div className="flex flex-col justify-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Multi-Entity Purchase Management System
            </h1>
            <p className="text-xl text-gray-600">
              Streamline your purchase requisitions, approvals, and vendor management across multiple entities with our comprehensive solution.
            </p>
            <div className="flex space-x-4">
              <SignedIn>
                <Link href="/dashboard">
                  <Button size="lg">Go to Dashboard</Button>
                </Link>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="redirect">
                  <Button size="lg">Go to Dashboard</Button>
                </SignInButton>
              </SignedOut>
              <Button variant="outline" size="lg" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Image 
              src="/hero-image.png" 
              alt="Purchase Management System" 
              width={500} 
              height={400}
              className="rounded-lg shadow-lg"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features section */}
      <section id="features" className="bg-gray-50 py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Multi-Entity Support</h3>
              <p className="text-gray-600">Manage purchases across multiple business entities with customized workflows and approvals.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Approval Workflows</h3>
              <p className="text-gray-600">Configure multi-level approval processes based on purchase amount, category, or entity.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Vendor Management</h3>
              <p className="text-gray-600">Maintain a centralized database of vendors with detailed information and performance metrics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Debug section - only visible in development */}
      {process.env.NODE_ENV === 'development' && (
        <section className="py-8 bg-gray-100">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-4">Development Debug Info</h2>
            <ClerkDebug />
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold">Purchase Manager</h2>
              <p className="text-gray-400">Streamlining procurement for construction companies</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/terms" className="text-gray-400 hover:text-white">Terms</Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white">Privacy</Link>
              <Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400 text-sm">
            {new Date().getFullYear()} Purchase Manager. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
