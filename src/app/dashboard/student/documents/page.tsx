"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tag, Clock, User, Search, ShoppingCart, Download, Star } from "lucide-react";

// Interface for documents available for purchase
interface MarketplaceDocument {
  id: string;
  title: string;
  subject: string;
  description?: string;
  price: number;
  fileName: string;
  uploadDate: string;
  tutor: {
    id: string;
    name: string;
    averageRating: number;
  };
  purchased: boolean;
}

type PurchaseStatusFilter = 'all' | 'purchased' | 'available';

// Mock Data (Combine documents from potentially multiple tutors)
const mockMarketplaceDocuments: MarketplaceDocument[] = [
  {
    id: "doc1",
    title: "Calculus Cheat Sheet",
    subject: "Mathematics",
    description: "Quick reference guide for common calculus formulas and theorems.",
    price: 5.00,
    fileName: "calculus_cheat_sheet_v1.pdf",
    uploadDate: "2024-03-15",
    tutor: { id: "t1", name: "Dr. Smith", averageRating: 4.8 },
    purchased: true, // Example: Purchased
  },
  {
    id: "doc2",
    title: "Physics Kinematics Explained",
    subject: "Physics",
    description: "In-depth explanation of kinematics concepts with examples.",
    price: 7.50,
    fileName: "physics_kinematics_notes.docx",
    uploadDate: "2024-03-18",
    tutor: { id: "t1", name: "Dr. Smith", averageRating: 4.8 },
    purchased: false,
  },
  {
    id: "doc3",
    title: "Organic Chemistry Reaction Mechanisms",
    subject: "Chemistry",
    description: "Summary of key reaction mechanisms for Orgo 1.",
    price: 10.00,
    fileName: "orgo1_mechanisms.pdf",
    uploadDate: "2024-03-20",
    tutor: { id: "t2", name: "Prof. Johnson", averageRating: 4.9 },
    purchased: false,
  },
  {
    id: "doc4",
    title: "History Essay Writing Guide",
    subject: "History",
    description: "Tips and structure for writing effective history essays.",
    price: 4.00,
    fileName: "history_essay_guide.pdf",
    uploadDate: "2024-03-21",
    tutor: { id: "t3", name: "Ms. Davis", averageRating: 4.7 },
    purchased: true, // Example: Purchased
  },
];

// Mock subjects for filtering
const subjects = [
  "All",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Literature",
  "Computer Science",
  "Other"
];

export default function StudentDocumentsPage() {
  // State for documents - maybe fetch based on filters
  const [documents, setDocuments] = useState<MarketplaceDocument[]>(mockMarketplaceDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [purchaseFilter, setPurchaseFilter] = useState<PurchaseStatusFilter>('available'); // Add purchase filter state

  const handlePurchaseClick = (doc: MarketplaceDocument) => {
    console.log(`Attempting to purchase ${doc.title} for €${doc.price.toFixed(2)}`);
    // TODO: Implement payment gateway integration
    alert(`Purchase simulation: ${doc.title} for €${doc.price.toFixed(2)}. After payment, enable download.`);
    // TODO: Update document state or user's purchased list to enable download
  };

  const handleDownloadPurchased = (doc: MarketplaceDocument) => {
    console.log(`Downloading purchased document: ${doc.fileName}`);
    alert(`Download simulation (already purchased): ${doc.fileName}`);
    // TODO: Implement secure download
  };

  // Filtering logic
  const filteredDocuments = documents.filter(doc => {
    // Purchase filter
    if (purchaseFilter === 'purchased' && !doc.purchased) return false;
    if (purchaseFilter === 'available' && doc.purchased) return false;

    // Existing filters
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = subjectFilter === "All" || doc.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Marketplace Documents</h1>
          <p className="text-muted-foreground">
            Browse and purchase documents uploaded by tutors.
          </p>
        </div>
        {/* Filter Group */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          {/* Purchase Status Filters */}
          <div className="flex items-center gap-2 border p-1 rounded-md">
            <Button
              variant={purchaseFilter === 'available' ? 'secondary' : 'ghost'}
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={() => setPurchaseFilter('available')}
            >
              Available
            </Button>
            <Button
              variant={purchaseFilter === 'purchased' ? 'secondary' : 'ghost'}
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={() => setPurchaseFilter('purchased')}
            >
              Purchased
            </Button>
            <Button
              variant={purchaseFilter === 'all' ? 'secondary' : 'ghost'}
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={() => setPurchaseFilter('all')}
            >
              All
            </Button>
          </div>
          {/* Subject Filter */}
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by subject..." />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Document List */}
      <div className="border rounded-lg">
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b last:border-b-0 gap-4"
            >
              {/* Left side: Details */}
              <div className="flex-1 space-y-1">
                <h3 className="font-semibold text-base">{doc.title}</h3>
                <div className="text-sm text-muted-foreground flex items-center flex-wrap gap-x-3 gap-y-1">
                  <span>{doc.subject}</span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" /> {doc.tutor.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    {doc.tutor.averageRating.toFixed(1)}
                  </span>
                </div>
                {doc.description && (
                  <p className="text-xs text-muted-foreground pt-1 line-clamp-2">
                    {doc.description}
                  </p>
                )}
              </div>
              {/* Right side: Price & Action */}
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                {/* Render Price only for documents not yet purchased */}
                {!doc.purchased ? (
                  <span className="font-semibold text-primary text-lg w-20 text-right">
                    €{doc.price.toFixed(2)}
                  </span>
                ) : (
                  <span className="w-20"></span>
                )}
                {/* Action Button Area */}
                <div className="w-28 text-right">
                  {doc.purchased ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDownloadPurchased(doc)}
                      className="w-full"
                    >
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handlePurchaseClick(doc)}
                      className="w-full"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" /> Buy Now
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground p-8">
            No documents found matching your criteria.
          </p>
        )}
      </div>
    </div>
  );
}