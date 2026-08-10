import React, { useState, useRef, useEffect } from 'react';
import { PortfolioData } from '../types';
import { 
  Printer, Download, X, Briefcase, GraduationCap, Mail, Linkedin, Github, 
  Award, MapPin, BookOpen, BarChart3, ZoomIn, ZoomOut, Maximize2, 
  FileText, Eye, CheckCircle2, Search, RotateCcw, Sparkles, Filter, 
  Share2, Copy, FileCheck, Layers
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ResumePreviewProps {
  data: PortfolioData;
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeDownload: React.FC<ResumePreviewProps> = ({ data, isOpen, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const pdfCanvasRef = useRef<HTMLDivElement>(null);
  
  const [viewMode, setViewMode] = useState<'document' | 'native' | 'text'>('document');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [highlightCategory, setHighlightCategory] = useState<'all' | 'metrics' | 'skills' | 'leadership'>('all');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [nativePdfUrl, setNativePdfUrl] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && viewMode === 'native' && !nativePdfUrl) {
      generateNativePdfBlob();
    }
  }, [isOpen, viewMode]);

  if (!isOpen) return null;

  // Generate real PDF Blob URL for native iframe preview
  const generateNativePdfBlob = async () => {
    if (!pdfCanvasRef.current) return;
    setIsGeneratingPdf(true);
    try {
      const element = pdfCanvasRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const blob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(blob);
      setNativePdfUrl(blobUrl);
    } catch (err) {
      console.error('Failed to generate native PDF blob:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Direct Download PDF Action using jsPDF + html2canvas
  const handleDownloadPdf = async () => {
    if (!pdfCanvasRef.current) {
      handlePrint();
      return;
    }
    setIsGeneratingPdf(true);
    try {
      const element = pdfCanvasRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Handle multi-page if content height exceeds A4 page height (297mm)
      const pageHeight = pdf.internal.pageSize.getHeight();
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `${data.name.replace(/\s+/g, '_')}_Executive_CV.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error('Error generating PDF file download:', err);
      // Fallback to browser print dialog
      handlePrint();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML;

    if (printContent) {
      const style = document.createElement('style');
      style.innerHTML = `
        @media print {
          body {
            background: white !important;
            color: black !important;
            font-family: 'Poppins', sans-serif !important;
            padding: 1.5cm !important;
          }
          .no-print {
            display: none !important;
          }
          .print-card {
            border: none !important;
            box-shadow: none !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .print-grid {
            grid-template-columns: 1fr !important;
            display: block !important;
          }
          .print-badge {
            border: 1px solid #ccc !important;
            color: #333 !important;
            background: transparent !important;
          }
          a {
            text-decoration: none !important;
            color: black !important;
          }
        }
      `;
      document.head.appendChild(style);
      window.print();
      document.head.removeChild(style);
    }
  };

  const handleDownloadText = () => {
    const text = `
=========================================
${data.name.toUpperCase()}
${data.title}
=========================================

CONTACT INFORMATION:
- Email: ${data.contact.email}
- LinkedIn: ${data.contact.linkedinDisplay}
- GitHub: ${data.contact.githubDisplay || 'github.com/ixjossboss'}
- Institution: ${data.education.institution}

EXECUTIVE SUMMARY:
${data.bio}

KEY PERFORMANCE METRICS:
${data.valueMetrics?.map(m => `- ${m.label}: ${m.value} (${m.sublabel})`).join('\n') || ''}

PROFESSIONAL EXPERIENCE:
${data.workExperience?.map(exp => `
-----------------------------------------
${exp.role.toUpperCase()} | ${exp.company} (${exp.period}) ${exp.location ? `| ${exp.location}` : ''}
${exp.bullets.map(b => `* ${b}`).join('\n')}
`).join('\n') || ''}

EDUCATION:
- ${data.education.institution}
  Degree: ${data.education.degree} (${data.education.status})
  Expected Graduation: ${data.education.expectedGraduation}
  Key Focus Areas:
  ${data.education.achievements.map(a => `  * ${a}`).join('\n')}

CERTIFICATIONS & CREDENTIALS:
${data.certifications?.map(c => `- ${c.name} | ${c.issuer} (${c.issueDate})`).join('\n') || ''}

CORE COMPETENCIES & METHODOLOGIES:
${data.skills.map(s => `- ${s.name} (Proficiency: ${s.proficiency}%)`).join('\n')}

STRUCTURED CASE STUDIES & PROJECTS:
${data.projects.map(p => `
-----------------------------------------
PROJECT: ${p.title} (${p.category})
- Overview: ${p.description}
- Challenge: ${p.challenge || 'N/A'}
- Strategic Approach: ${p.strategicApproach || 'N/A'}
- Execution: ${p.execution || 'N/A'}
- Measurable Outcomes: ${p.measurableResults?.map(m => `${m.label}: ${m.value}`).join(' | ') || 'N/A'}
- Deliverables: ${p.deliverables?.join(', ') || 'N/A'}
- Methods & Tools: ${p.tags.join(', ')}
`).join('\n')}

PUBLICATIONS & THOUGHT LEADERSHIP:
${data.publications?.map(pub => `- ${pub.title} (${pub.publisher}, ${pub.date})\n  Summary: ${pub.summary}`).join('\n\n') || ''}

ENDORSEMENTS & TESTIMONIALS:
${data.testimonials?.map(t => `- "${t.quote}" -- ${t.author}, ${t.role} (${t.company})`).join('\n\n') || ''}

-----------------------------------------
Generated online at ${data.name} Executive Portfolio.
`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.name.replace(/\s+/g, '_')}_CV.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Helper to check if text matches current search query
  const matchesSearch = (text: string) => {
    if (!searchQuery.trim()) return false;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  // Helper class for search matching or category highlights
  const getHighlightClass = (text: string, category?: 'metrics' | 'skills' | 'leadership') => {
    const searchMatch = matchesSearch(text);
    const categoryMatch = highlightCategory !== 'all' && highlightCategory === category;

    if (searchMatch) {
      return 'bg-amber-200 dark:bg-amber-800/80 text-amber-950 dark:text-amber-100 font-bold px-1 rounded ring-2 ring-amber-400 transition-all';
    }
    if (categoryMatch) {
      return 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-400 p-0.5 rounded transition-all';
    }
    return '';
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4 overflow-hidden no-print animate-fade-in">
      <div className="bg-slate-900 rounded-2xl max-w-6xl w-full shadow-2xl overflow-hidden flex flex-col h-[94vh] border border-slate-800">
        
        {/* PDF Reader Top Navigation Header */}
        <div className="bg-slate-950 text-white px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          
          {/* Document Title & Status */}
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-xl text-emerald-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white tracking-tight">{data.name.replace(/\s+/g, '_')}_Executive_CV.pdf</h3>
                <span className="bg-slate-800 text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-slate-700 hidden sm:inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Verified PDF/A
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">Interactive In-Browser PDF Previewer & Credential Scanner</p>
            </div>
          </div>

          {/* View Mode Tabs */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('document')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                viewMode === 'document'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Formatted Document</span>
            </button>

            <button
              onClick={() => setViewMode('native')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                viewMode === 'native'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Native PDF Embed</span>
              <span className="sm:hidden">PDF</span>
            </button>

            <button
              onClick={() => setViewMode('text')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                viewMode === 'text'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ATS Plain Text</span>
              <span className="sm:hidden">Text</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white transition text-xs font-bold px-3.5 py-2 rounded-xl cursor-pointer disabled:opacity-50 shadow-sm"
              title="Download clean high-resolution PDF document"
            >
              <Download className="w-4 h-4" />
              <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 transition text-xs font-semibold px-3 py-2 rounded-xl cursor-pointer"
              title="Print CV using browser dialog"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>

            <button
              onClick={handleShareLink}
              className="hidden md:flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 transition text-xs font-semibold px-3 py-2 rounded-xl cursor-pointer"
              title="Copy link to portfolio"
            >
              {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? 'Copied Link!' : 'Share'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white transition hover:bg-slate-800 rounded-xl cursor-pointer ms-1"
              title="Close Previewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* PDF Reader Interactive Control Toolbar (For Document Mode) */}
        {viewMode === 'document' && (
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 text-slate-300">
            
            {/* Page Jump & Scroll Controls */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px] font-medium">Page View:</span>
              <button
                onClick={() => setCurrentPage(1)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                  currentPage === 1 ? 'bg-primary text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                Page 1
              </button>
              <button
                onClick={() => setCurrentPage(2)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                  currentPage === 2 ? 'bg-primary text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                Page 2
              </button>
              <span className="text-slate-500 text-[10px] ms-1">(Page 1 of 2)</span>
            </div>

            {/* Zoom Slider / Controls */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setZoomLevel(prev => Math.max(70, prev - 15))}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              <span className="text-[11px] font-mono text-slate-300 w-12 text-center select-none font-bold">
                {zoomLevel}%
              </span>

              <button
                onClick={() => setZoomLevel(prev => Math.min(140, prev + 15))}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setZoomLevel(100)}
                className="px-1.5 py-0.5 text-[10px] text-slate-400 hover:text-white hover:bg-slate-800 rounded cursor-pointer font-medium"
                title="Reset Zoom"
              >
                Reset
              </button>
            </div>

            {/* Live Search Box */}
            <div className="relative flex items-center max-w-xs w-full sm:w-auto">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search credentials, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs rounded-lg pl-8 pr-7 py-1 w-full sm:w-48 focus:outline-none focus:border-primary"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  &times;
                </button>
              )}
            </div>

            {/* Quick Spotlight Filters */}
            <div className="flex items-center gap-1 hidden lg:flex">
              <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium me-1">
                <Filter className="w-3 h-3 text-primary" />
                Spotlight:
              </span>
              <button
                onClick={() => setHighlightCategory('all')}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                  highlightCategory === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setHighlightCategory('metrics')}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                  highlightCategory === 'metrics' ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-700' : 'text-slate-400 hover:text-white'
                }`}
              >
                Metrics
              </button>
              <button
                onClick={() => setHighlightCategory('skills')}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                  highlightCategory === 'skills' ? 'bg-primary/30 text-primary-light border border-primary/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                Skills
              </button>
              <button
                onClick={() => setHighlightCategory('leadership')}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                  highlightCategory === 'leadership' ? 'bg-amber-900/60 text-amber-200 border border-amber-700' : 'text-slate-400 hover:text-white'
                }`}
              >
                Leadership
              </button>
            </div>

          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6 md:p-8 flex justify-center items-start">
          
          {/* MODE 1: Formatted PDF Document Canvas View */}
          {viewMode === 'document' && (
            <div className="w-full flex flex-col items-center gap-8">
              
              {/* Outer Printable & Capturable Container */}
              <div 
                ref={printRef}
                className="transition-transform duration-200 origin-top flex flex-col items-center w-full max-w-4xl"
                style={{ transform: `scale(${zoomLevel / 100})` }}
              >
                <div 
                  ref={pdfCanvasRef}
                  className="bg-white text-slate-800 shadow-2xl rounded-none sm:rounded-sm border border-slate-300 p-8 sm:p-12 w-full max-w-[800px] print-card font-sans text-sm space-y-8 min-h-[1050px] relative"
                >
                  
                  {/* Top Watermark / Document Header */}
                  <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 select-none">
                    <span>Confidential Executive CV • {data.name}</span>
                    <span>University of the People Alumni</span>
                  </div>

                  {/* Header & Contact Info */}
                  <div className="border-b-2 border-primary pb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h1 className={`text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight ${getHighlightClass(data.name)}`}>
                          {data.name}
                        </h1>
                        <p className={`text-primary font-bold text-sm mt-1 ${getHighlightClass(data.title, 'leadership')}`}>
                          {data.title}
                        </p>
                      </div>

                      <div className="flex flex-col gap-1 text-slate-600 text-xs text-left md:text-right">
                        <span className="flex items-center md:justify-end gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-primary" />
                          <a href={`mailto:${data.contact.email}`} className="hover:underline font-medium">{data.contact.email}</a>
                        </span>
                        <span className="flex items-center md:justify-end gap-1.5">
                          <Linkedin className="w-3.5 h-3.5 text-primary" />
                          <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium">{data.contact.linkedinDisplay}</a>
                        </span>
                        {data.contact.github && (
                          <span className="flex items-center md:justify-end gap-1.5">
                            <Github className="w-3.5 h-3.5 text-primary" />
                            <a href={data.contact.github} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium">{data.contact.githubDisplay || 'github.com/ixjossboss'}</a>
                          </span>
                        )}
                        <span className="flex items-center md:justify-end gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          <span>{data.contact.address || 'Global / Remote'}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Executive Bio / Profile Summary */}
                  <div>
                    <h2 className="text-xs uppercase tracking-widest font-bold text-slate-900 bg-slate-100 border-s-4 border-primary px-3 py-1.5 mb-2.5 flex items-center justify-between">
                      <span>Executive Overview</span>
                      <span className="text-[9px] font-normal text-slate-500">Page 1</span>
                    </h2>
                    <p className={`text-slate-700 leading-relaxed text-xs sm:text-sm ${getHighlightClass(data.bio)}`}>
                      {data.bio}
                    </p>
                  </div>

                  {/* Key Value Metrics */}
                  {data.valueMetrics && data.valueMetrics.length > 0 && (
                    <div>
                      <h2 className="text-xs uppercase tracking-widest font-bold text-slate-900 bg-slate-100 border-s-4 border-primary px-3 py-1.5 mb-3 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-primary" />
                        <span>Key Impact & Performance Metrics</span>
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                        {data.valueMetrics.map((m) => (
                          <div 
                            key={m.id} 
                            className={`bg-slate-50 border border-slate-200 p-3 rounded-lg shadow-xs ${getHighlightClass(m.value, 'metrics')}`}
                          >
                            <div className="text-lg font-black text-primary">{m.value}</div>
                            <div className="text-[11px] font-bold text-slate-800 mt-0.5">{m.label}</div>
                            {m.sublabel && <div className="text-[9px] text-slate-500 mt-0.5">{m.sublabel}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Page 1 / Page 2 Divider Visual */}
                  <div className="border-t-2 border-dashed border-slate-300 my-8 pt-4 flex justify-between items-center text-[10px] text-slate-400 select-none">
                    <span className="flex items-center gap-1 font-bold uppercase text-slate-500">
                      <Layers className="w-3 h-3 text-primary" />
                      Page 1 of 2
                    </span>
                    <span>Michael Omowa — Executive CV</span>
                  </div>

                  {/* Professional Experience */}
                  {data.workExperience && data.workExperience.length > 0 && (
                    <div id="page-2-section">
                      <h2 className="text-xs uppercase tracking-widest font-bold text-slate-900 bg-slate-100 border-s-4 border-primary px-3 py-1.5 mb-3 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-primary" />
                        <span>Professional Experience & Leadership</span>
                      </h2>
                      <div className="space-y-4">
                        {data.workExperience.map((exp) => (
                          <div key={exp.id} className="border-b border-slate-100 pb-3 last:border-b-0 space-y-1.5">
                            <div className="flex justify-between items-baseline flex-wrap gap-1">
                              <h3 className={`font-bold text-slate-900 text-xs sm:text-sm ${getHighlightClass(exp.role, 'leadership')}`}>
                                {exp.role} — <span className="text-primary">{exp.company}</span>
                              </h3>
                              <span className="text-[11px] text-slate-500 font-mono font-medium">{exp.period}</span>
                            </div>
                            <ul className="space-y-1 text-xs text-slate-700 list-disc list-inside">
                              {exp.bullets.map((b, idx) => (
                                <li key={idx} className={`leading-relaxed ${getHighlightClass(b, 'metrics')}`}>{b}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Grid Layout for Education, Certifications & Competencies */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print-grid">
                    
                    {/* Column 1: Education & Certs */}
                    <div className="md:col-span-1 space-y-5">
                      {/* Education */}
                      <div>
                        <h2 className="text-xs uppercase tracking-widest font-bold text-slate-900 bg-slate-100 border-s-4 border-primary px-3 py-1.5 mb-2.5 flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-primary" />
                          <span>Education</span>
                        </h2>
                        <div className="space-y-1">
                          <h3 className={`font-bold text-slate-900 text-xs ${getHighlightClass(data.education.institution)}`}>
                            {data.education.institution}
                          </h3>
                          <p className="text-primary font-bold text-[11px]">{data.education.degree}</p>
                          <p className="text-slate-500 text-[10px] font-medium">Expected: {data.education.expectedGraduation}</p>
                          
                          <ul className="mt-2 space-y-1 text-[11px] text-slate-600 list-disc list-inside">
                            {data.education.achievements.map((ach, idx) => (
                              <li key={idx} className={getHighlightClass(ach)}>{ach}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Certifications */}
                      {data.certifications && data.certifications.length > 0 && (
                        <div>
                          <h2 className="text-xs uppercase tracking-widest font-bold text-slate-900 bg-slate-100 border-s-4 border-primary px-3 py-1.5 mb-2.5 flex items-center gap-2">
                            <Award className="w-4 h-4 text-primary" />
                            <span>Certifications</span>
                          </h2>
                          <div className="space-y-2">
                            {data.certifications.map((c) => (
                              <div key={c.id} className="text-xs border-b border-slate-100 pb-1.5 last:border-b-0">
                                <div className={`font-bold text-slate-900 leading-snug ${getHighlightClass(c.name)}`}>{c.name}</div>
                                <div className="text-[10px] text-slate-500">{c.issuer} • {c.issueDate}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Column 2: Core Competencies & Skills */}
                    <div className="md:col-span-2 space-y-5">
                      <div>
                        <h2 className="text-xs uppercase tracking-widest font-bold text-slate-900 bg-slate-100 border-s-4 border-primary px-3 py-1.5 mb-2.5 flex items-center justify-between">
                          <span>Core Methodologies & Technical Skills</span>
                          <span className="text-[9px] text-slate-500">Proficiency Rating</span>
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {data.skills.map((skill) => (
                            <div key={skill.id} className={`p-1.5 rounded border border-slate-100 ${getHighlightClass(skill.name, 'skills')}`}>
                              <div className="flex justify-between items-center text-xs mb-0.5">
                                <span className="font-bold text-slate-900">{skill.name}</span>
                                <span className="text-[10px] font-mono text-slate-500">{skill.proficiency}%</span>
                              </div>
                              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-primary h-full rounded-full" style={{ width: `${skill.proficiency}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Featured Projects / Case Studies */}
                      {data.projects && data.projects.length > 0 && (
                        <div>
                          <h2 className="text-xs uppercase tracking-widest font-bold text-slate-900 bg-slate-100 border-s-4 border-primary px-3 py-1.5 mb-2.5 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-primary" />
                            <span>Selected Case Studies</span>
                          </h2>
                          <div className="space-y-3">
                            {data.projects.slice(0, 2).map((proj) => (
                              <div key={proj.id} className="border-b border-slate-100 pb-2 last:border-b-0 text-xs space-y-1">
                                <div className="flex justify-between items-baseline">
                                  <span className={`font-bold text-slate-900 ${getHighlightClass(proj.title)}`}>{proj.title}</span>
                                  <span className="text-[9px] text-primary font-bold uppercase">{proj.category}</span>
                                </div>
                                <p className="text-slate-600 text-[11px] leading-snug">{proj.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>

                  </div>

                  {/* Document Footer Verification */}
                  <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 gap-2 select-none">
                    <span>Verified Executive Document • {data.name}</span>
                    <span className="font-mono">Ref ID: MO-{new Date().getFullYear()}-EXEC-CV</span>
                    <span>Page 2 of 2</span>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* MODE 2: Native PDF Viewer Embed Mode */}
          {viewMode === 'native' && (
            <div className="w-full h-full flex flex-col items-center justify-center">
              {isGeneratingPdf ? (
                <div className="flex flex-col items-center justify-center p-12 text-slate-300 space-y-4">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-semibold">Generating Native PDF Stream...</p>
                </div>
              ) : nativePdfUrl ? (
                <iframe
                  src={nativePdfUrl}
                  title="Michael Omowa Executive CV PDF Viewer"
                  className="w-full h-full min-h-[600px] rounded-xl border border-slate-800 shadow-2xl bg-slate-900"
                />
              ) : (
                <div className="text-center p-8 text-slate-400 space-y-4">
                  <p className="text-sm">Native PDF stream ready for compilation.</p>
                  <button
                    onClick={generateNativePdfBlob}
                    className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                  >
                    Render Native PDF Preview
                  </button>
                </div>
              )}
            </div>
          )}

          {/* MODE 3: ATS Plain Text Scanner View */}
          {viewMode === 'text' && (
            <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-300 font-mono text-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ATS-Optimized Plain Text Format</span>
                </div>
                <button
                  onClick={handleDownloadText}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download TXT</span>
                </button>
              </div>

              <textarea
                readOnly
                value={`NAME: ${data.name.toUpperCase()}
TITLE: ${data.title}
EMAIL: ${data.contact.email}
LINKEDIN: ${data.contact.linkedinDisplay}
INSTITUTION: ${data.education.institution}

EXECUTIVE SUMMARY:
${data.bio}

KEY PERFORMANCE METRICS:
${data.valueMetrics?.map(m => `- ${m.label}: ${m.value}`).join('\n') || ''}

PROFESSIONAL EXPERIENCE:
${data.workExperience?.map(exp => `* ${exp.role.toUpperCase()} @ ${exp.company} (${exp.period})\n${exp.bullets.map(b => `  - ${b}`).join('\n')}`).join('\n\n') || ''}

EDUCATION:
- ${data.education.institution}: ${data.education.degree} (Expected: ${data.education.expectedGraduation})

SKILLS:
${data.skills.map(s => `- ${s.name} (${s.proficiency}%)`).join('\n')}
`}
                className="w-full h-[60vh] bg-slate-950 text-emerald-300/90 border border-slate-800 p-4 rounded-xl focus:outline-none select-all leading-relaxed"
              />
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
