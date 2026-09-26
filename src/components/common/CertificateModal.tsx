import React, { useRef, useState } from 'react';
import { UserProfile, CertificateType } from '../../types';
import { X, Download, Award, CheckCircle, Share2, Sparkles, Printer } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  verifiedKarma: number;
  groupName?: string;
  type?: CertificateType;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  user,
  verifiedKarma,
  groupName = 'Group Alpha',
  type = 'PARTICIPANT',
}) => {
  const certRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const certNumber = `STRIDE-CERT-2027-${user.registration_id.replace(/[^0-9]/g, '') || '884920'}`;
  const issueDate = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const getTitle = () => {
    switch (type) {
      case 'TOP_STUDENT':
        return 'CERTIFICATE OF EXCELLENCE — TOP STUDENT';
      case 'TOP_VOLUNTEER':
        return 'CERTIFICATE OF LEADERSHIP — TOP VOLUNTEER';
      default:
        return 'CERTIFICATE OF ACHIEVEMENT & PARTICIPATION';
    }
  };

  const getSubtitle = () => {
    switch (type) {
      case 'TOP_STUDENT':
        return `This certifies that ${user.full_name} has achieved the highest honors as the #1 Top Student in the STRIDE 2027 Challenge by earning ${verifiedKarma.toLocaleString()} Verified Karma Points through exceptional μJourney milestones.`;
      case 'TOP_VOLUNTEER':
        return `This certifies that ${user.full_name} has been recognized as the Top Volunteer in STRIDE 2027 for exceptional mentorship and driving ${groupName} to the highest verified Karma milestone.`;
      default:
        return `This is to certify that ${user.full_name} from ${user.college || 'Engineering College'} has successfully completed the STRIDE 2027 First-Year Challenge, earning ${verifiedKarma.toLocaleString()} Verified Karma points across technical and soft-skill μJourney tasks.`;
    }
  };

  const handleDownloadPNG = async () => {
    if (!certRef.current) return;
    try {
      setIsDownloading(true);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#070B12',
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `STRIDE_Certificate_${user.full_name.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export certificate PNG:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!certRef.current) return;
    try {
      setIsDownloading(true);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });

      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#070B12',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`STRIDE_Certificate_${user.full_name.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('Failed to export PDF:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1200 }}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '900px', width: '96vw', padding: '0', background: 'var(--bg-card-solid)' }}
      >
        {/* Modal Actions Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'rgba(51, 104, 160, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} color="var(--accent-gold)" />
            <span style={{ fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--warm-white)' }}>
              STRIDE Official Certificate of Completion
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleDownloadPNG}
              disabled={isDownloading}
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.82rem', gap: '6px' }}
            >
              <Download size={14} /> PNG
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="btn-gold"
              style={{ padding: '8px 16px', fontSize: '0.82rem', gap: '6px' }}
            >
              <Printer size={14} /> Download PDF
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: 'var(--warm-white)',
                cursor: 'pointer',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Certificate Render Viewport */}
        <div style={{ padding: '24px', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
          <div
            ref={certRef}
            style={{
              width: '820px',
              minHeight: '560px',
              background: 'radial-gradient(circle at 50% 50%, #111A2B 0%, #080C14 100%)',
              border: '10px double #F59E0B',
              borderRadius: '16px',
              padding: '40px 48px',
              color: '#F2EFE7',
              position: 'relative',
              boxShadow: '0 0 50px rgba(0, 0, 0, 0.9), inset 0 0 30px rgba(51, 104, 160, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-body)',
              boxSizing: 'border-box',
            }}
          >
            {/* Corner Decorative Borders */}
            <div style={{ position: 'absolute', top: '16px', left: '16px', width: '32px', height: '32px', borderTop: '2px solid #F59E0B', borderLeft: '2px solid #F59E0B' }} />
            <div style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', borderTop: '2px solid #F59E0B', borderRight: '2px solid #F59E0B' }} />
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', width: '32px', height: '32px', borderBottom: '2px solid #F59E0B', borderLeft: '2px solid #F59E0B' }} />
            <div style={{ position: 'absolute', bottom: '16px', right: '16px', width: '32px', height: '32px', borderBottom: '2px solid #F59E0B', borderRight: '2px solid #F59E0B' }} />

            {/* Header with Logo */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(245, 158, 11, 0.3)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src="/stride-logo.jpg"
                  alt="STRIDE Logo"
                  style={{ width: '46px', height: '46px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #F59E0B' }}
                />
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', letterSpacing: '0.05em', color: '#FFF', margin: 0 }}>
                    STRIDE <span style={{ color: '#F59E0B' }}>2027</span>
                  </h2>
                  <span style={{ fontSize: '0.72rem', color: '#38BDF8', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
                    μLearn First-Year Challenge
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#9C988D', display: 'block' }}>
                  Certificate ID:
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#F59E0B', fontWeight: 700 }}>
                  {certNumber}
                </span>
              </div>
            </div>

            {/* Main Certificate Body */}
            <div style={{ textAlign: 'center', margin: '24px 0' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.85rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#F59E0B',
                  fontWeight: 700,
                  display: 'block',
                  marginBottom: '10px',
                }}
              >
                {getTitle()}
              </span>

              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.4rem',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                  margin: '8px 0 16px 0',
                  borderBottom: '2px solid rgba(56, 189, 248, 0.4)',
                  display: 'inline-block',
                  paddingBottom: '4px',
                  paddingLeft: '24px',
                  paddingRight: '24px',
                }}
              >
                {user.full_name}
              </h1>

              <p
                style={{
                  fontSize: '0.95rem',
                  color: '#D8D4C7',
                  maxWidth: '680px',
                  margin: '0 auto',
                  lineHeight: 1.6,
                }}
              >
                {getSubtitle()}
              </p>

              {/* Stats Highlight Ribbon */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '24px',
                  background: 'rgba(51, 104, 160, 0.2)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '12px',
                  padding: '10px 24px',
                  marginTop: '20px',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#9C988D', textTransform: 'uppercase', display: 'block' }}>
                    Verified Karma
                  </span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: '#10B981' }}>
                    {verifiedKarma.toLocaleString()} KARMA
                  </span>
                </div>
                <div style={{ width: '1px', height: '28px', background: 'rgba(255, 255, 255, 0.1)' }} />
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#9C988D', textTransform: 'uppercase', display: 'block' }}>
                    Group Assigned
                  </span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: '#38BDF8' }}>
                    {groupName}
                  </span>
                </div>
                <div style={{ width: '1px', height: '28px', background: 'rgba(255, 255, 255, 0.1)' }} />
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#9C988D', textTransform: 'uppercase', display: 'block' }}>
                    Registration ID
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 700, color: '#F2EFE7' }}>
                    {user.registration_id}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer with Signatures & Official Gold Seal */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderTop: '1px solid rgba(245, 158, 11, 0.3)', paddingTop: '16px' }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.1rem', color: '#38BDF8', marginBottom: '4px' }}>
                  Johnathan Archer
                </div>
                <div style={{ width: '140px', height: '1px', background: 'rgba(255, 255, 255, 0.3)', marginBottom: '4px' }} />
                <span style={{ fontSize: '0.72rem', color: '#9C988D', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                  Lead Organizer & Super Admin
                </span>
                <span style={{ fontSize: '0.68rem', color: '#9C988D' }}>STRIDE 2027 Committee</span>
              </div>

              {/* Official Gold Embossed Stamp */}
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  border: '3px dashed #F59E0B',
                  background: 'radial-gradient(circle, #F59E0B22 0%, #F59E0B44 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)',
                }}
              >
                <Sparkles size={18} color="#F59E0B" />
                <span style={{ fontSize: '0.55rem', fontWeight: 900, color: '#F59E0B', letterSpacing: '0.05em', marginTop: '2px' }}>
                  VERIFIED
                </span>
                <span style={{ fontSize: '0.5rem', color: '#FFF' }}>μLearn 2027</span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.1rem', color: '#38BDF8', marginBottom: '4px' }}>
                  μLearn Foundation
                </div>
                <div style={{ width: '140px', height: '1px', background: 'rgba(255, 255, 255, 0.3)', marginBottom: '4px', marginLeft: 'auto' }} />
                <span style={{ fontSize: '0.72rem', color: '#9C988D', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                  Date of Issue: {issueDate}
                </span>
                <span style={{ fontSize: '0.68rem', color: '#10B981', fontWeight: 600 }}>Digitally Verified on STRIDE Ledger</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
