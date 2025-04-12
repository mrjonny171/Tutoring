"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, Book, GraduationCap, MessageSquare, Users, Sparkles, Rocket, Target, Github, Twitter, Linkedin, Check, UserPlus, Search, CalendarPlus, FileText, ClipboardEdit, BadgeCheck, CalendarCheck, FileCheck, DollarSign } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Parallax Effect */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background z-10" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        <div className="container relative z-20 px-4 md:px-6 mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center space-y-4 text-center max-w-4xl mx-auto"
          >
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              <span>Transform Your Learning Journey</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
            >
              Master Your Subjects with Expert Tutors
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mx-auto max-w-[700px] text-muted-foreground md:text-xl"
            >
              Connect with experienced tutors, access quality study materials, and achieve your academic goals with our comprehensive tutoring platform.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="space-x-4"
            >
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link href="/register">
                  Get Started <Rocket className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Sign In</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- How It Works Section (REVISED) --- */}
      <section id="how-it-works" className="w-full py-20 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center space-y-4 text-center mb-16 max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">How TutorHub Works</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
              Getting started is simple for both students and tutors.
            </p>
          </motion.div>

          <div className="grid gap-12 md:gap-16 lg:grid-cols-2 max-w-6xl mx-auto">
            {/* Student Steps */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h3 className="text-2xl font-semibold text-center md:text-left">For Students</h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg mb-1">1. Sign Up & Find Tutors</h4>
                    <p className="text-muted-foreground text-sm">Create your free account and easily search or browse profiles of expert tutors.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <CalendarPlus className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg mb-1">2. Schedule or Request Help</h4>
                    <p className="text-muted-foreground text-sm">Book live sessions directly through the calendar or submit exercise requests for specific problems.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg mb-1">3. Learn & Achieve</h4>
                    <p className="text-muted-foreground text-sm">Attend sessions, receive detailed solutions, track progress on your dashboard, and reach your goals.</p>
                  </div>
                </li>
              </ul>
            </motion.div>

            {/* Tutor Steps */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h3 className="text-2xl font-semibold text-center md:text-left">For Tutors</h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                    <ClipboardEdit className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg mb-1">1. Apply & Get Verified</h4>
                    <p className="text-muted-foreground text-sm">Showcase your expertise by creating a detailed profile and completing our verification process.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                    <CalendarCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg mb-1">2. Manage Your Schedule</h4>
                    <p className="text-muted-foreground text-sm">Set your availability, accept session bookings, and respond to student exercise requests.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg mb-1">3. Teach, Earn & Grow</h4>
                    <p className="text-muted-foreground text-sm">Conduct impactful sessions, provide quality solutions, manage payouts, and build your reputation.</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section with 3D Cards */}
      <section className="w-full py-24 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12 max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Why Choose Us</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
              Our platform offers everything you need to succeed in your academic journey.
            </p>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Expert Tutors</CardTitle>
                  <CardDescription>
                    Learn from experienced tutors who are passionate about teaching and helping students succeed.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                    <Book className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Study Materials</CardTitle>
                  <CardDescription>
                    Access a vast library of study materials, exercises, and solutions to enhance your learning.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Personalized Learning</CardTitle>
                  <CardDescription>
                    Get customized learning plans and one-on-one attention to help you achieve your goals.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Our Core Services Section --- */}
      <section id="services" className="w-full py-20 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12 max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Core Services</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
              Comprehensive support designed for your academic success.
            </p>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {/* Service 1: 1-on-1 Sessions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Live 1-on-1 Sessions</CardTitle>
                  <CardDescription>
                    Connect with tutors via video call for personalized guidance and real-time interaction.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            {/* Service 2: Exercise Help */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                    <Book className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Exercise & Homework Help</CardTitle>
                  <CardDescription>
                    Submit specific problems or assignments and receive detailed, step-by-step solutions from experts.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            {/* Service 3: Flexible Scheduling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                    <MessageSquare className="h-6 w-6 text-primary" /> {/* Using MessageSquare for scheduling/communication */}
                  </div>
                  <CardTitle>Flexible Scheduling</CardTitle>
                  <CardDescription>
                    Easily book sessions at times that fit your schedule directly with your chosen tutor.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

             {/* Service 4: Wide Subject Range */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Diverse Subjects</CardTitle>
                  <CardDescription>
                    Find help across a wide range of academic subjects, from STEM to humanities.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
            
             {/* Service 5: Progress Tracking */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Progress Dashboard</CardTitle>
                  <CardDescription>
                    Monitor your session history, exercise status, and performance metrics all in one place.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

             {/* Service 6: Quality Assurance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Verified Tutors</CardTitle>
                  <CardDescription>
                    Work with confidence knowing all tutors are vetted for expertise and experience.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-24 bg-muted">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-8 md:grid-cols-4 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-primary">500+</div>
              <div className="text-muted-foreground">Active Tutors</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-primary">10,000+</div>
              <div className="text-muted-foreground">Happy Students</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-primary">95%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-primary">24/7</div>
              <div className="text-muted-foreground">Support Available</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Pricing Section --- */}
      <section id="pricing" className="w-full py-24 bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12 max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Flexible Pricing Plans</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
              Choose the plan that best fits your needs. Simple, transparent pricing.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {/* Student Basic Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 border-primary/20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Student Basic</CardTitle>
                  <CardDescription>Access core features and connect with tutors.</CardDescription>
                  <div className="text-4xl font-bold pt-4">Free</div>
                </CardHeader>
                <CardContent className="flex-1 space-y-3">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Browse Tutor Profiles</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Schedule Sessions</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Submit Exercise Requests (Limited)</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Basic Dashboard</li>
                  </ul>
                </CardContent>
                <CardFooter className="pt-4">
                   <Button asChild className="w-full bg-primary hover:bg-primary/90 cursor-pointer">
                     <Link href="/register">Get Started</Link>
                   </Button>
                 </CardFooter>
              </Card>
            </motion.div>

            {/* Student Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 border-2 border-primary ring-4 ring-primary/10">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                     <CardTitle className="text-xl">Student Pro</CardTitle>
                     <Badge variant="default">Popular</Badge>
                  </div>
                  <CardDescription>Unlock advanced features and priority support.</CardDescription>
                  <div className="text-4xl font-bold pt-4">€9<span className="text-lg text-muted-foreground">/month</span></div>
                </CardHeader>
                <CardContent className="flex-1 space-y-3">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Everything in Basic</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Unlimited Exercise Requests</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Advanced Dashboard Analytics</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Access to Premium Materials</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Priority Support</li>
                  </ul>
                </CardContent>
                <CardFooter className="pt-4">
                   <Button asChild className="w-full bg-primary hover:bg-primary/90 cursor-pointer">
                     <Link href="/register?plan=pro">Choose Pro</Link>
                   </Button>
                 </CardFooter>
              </Card>
            </motion.div>

            {/* Tutor Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 border-primary/20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Tutor Account</CardTitle>
                  <CardDescription>Offer your expertise and manage students.</CardDescription>
                  <div className="text-4xl font-bold pt-4">Free<span className="text-lg text-muted-foreground">*</span></div>
                   <p className="text-xs text-muted-foreground pt-1">*Platform fees apply per solved exercise/session.</p>
                </CardHeader>
                <CardContent className="flex-1 space-y-3">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Create Public Profile</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Accept Exercise Requests</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Manage Student Sessions</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Upload Solutions & Materials</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Tutor Dashboard & Payouts</li>
                  </ul>
                </CardContent>
                <CardFooter className="pt-4">
                   <Button asChild className="w-full bg-primary hover:bg-primary/90 cursor-pointer">
                     <Link href="/register?role=tutor">Become a Tutor</Link>
                   </Button>
                 </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      {/* --- End Pricing Section --- */}

      {/* --- FAQ Section --- */}
      <section id="faq" className="w-full py-24 bg-muted">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12 max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Frequently Asked Questions</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
              Have questions? We've got answers. Find information about our platform and services.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I find a tutor?</AccordionTrigger>
                <AccordionContent>
                  Students can browse tutor profiles based on subject, availability, and ratings. You can view detailed profiles before scheduling a session or requesting exercise help.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>What are Exercise Requests?</AccordionTrigger>
                <AccordionContent>
                  Students can submit specific problems or assignments as an "Exercise Request" with a proposed price. Available tutors can accept the request, provide a solution by the deadline, and receive payment through the platform upon successful completion.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>How does scheduling work?</AccordionTrigger>
                <AccordionContent>
                  Both students and tutors can propose session times through the integrated scheduling tool. Once a time is agreed upon, it appears on both users' dashboards. Sessions can be marked as online or in-person.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>How do tutors get paid?</AccordionTrigger>
                <AccordionContent>
                  Tutors set their own prices for sessions or exercise solutions. Payments are processed securely through the platform after a session is completed or an exercise solution is delivered. A small platform fee is deducted from the tutor's earnings.
                </AccordionContent>
              </AccordionItem>
               <AccordionItem value="item-5">
                <AccordionTrigger>What if I'm not satisfied with a session or solution?</AccordionTrigger>
                <AccordionContent>
                  We encourage open communication between students and tutors. If issues arise, please contact our support team through the dashboard. We offer mediation and a resolution process to ensure satisfaction.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>
      </section>
      {/* --- End FAQ Section --- */}

      {/* CTA Section */}
      <section className="w-full py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center space-y-4 text-center max-w-4xl mx-auto"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Get Started?</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                Join our community of learners and start your journey to academic success today.
              </p>
            </div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link href="/register">
                  Create Account <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 bg-muted border-t">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-8 md:grid-cols-4 max-w-6xl mx-auto">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">TutorHub</h3>
              <p className="text-sm text-muted-foreground">
                Transform your learning experience with expert tutors and quality study materials.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  <Github className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/exercises" className="text-sm text-muted-foreground hover:text-primary">
                    Exercises
                  </Link>
                </li>
                <li>
                  <Link href="/documents" className="text-sm text-muted-foreground hover:text-primary">
                    Documents
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                    Study Materials
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                    Practice Tests
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                    Learning Guides
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact</h3>
              <ul className="space-y-2">
                <li className="text-sm text-muted-foreground">
                  Email: support@tutorhub.com
                </li>
                <li className="text-sm text-muted-foreground">
                  Phone: +1 (555) 123-4567
                </li>
                <li className="text-sm text-muted-foreground">
                  Address: 123 Education St, Learning City
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2024 TutorHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
