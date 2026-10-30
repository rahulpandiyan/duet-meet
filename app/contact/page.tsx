import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import { Mail, Shield, AlertTriangle, FileText, Server } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Support",
  description:
    "Get in touch with the Duet engineering and support team for questions, feedback, or technical assistance.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <LegalLayout title="Contact & Legal Inquiries" updated="October 30, 2026" badge="Support & Legal">
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700">
        <strong className="text-slate-900">Direct Communication Channels:</strong> Whether you have technical inquiries, require privacy assistance, or wish to report a security vulnerability or DMCA notice, please route your request to the appropriate channel below.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-5 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2">
          <div className="h-9 w-9 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 mb-2">
            <Mail size={18} />
          </div>
          <h3 className="text-sm font-bold text-slate-900">General Inquiries &amp; Support</h3>
          <p className="text-slate-600 leading-relaxed">
            For general product questions, feedback, or integration assistance with simultaneous screen sharing.
          </p>
          <div className="pt-2">
            <span className="font-mono text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200 font-medium">
              support@duetmeet.com
            </span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2">
          <div className="h-9 w-9 rounded-lg bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-600 mb-2">
            <Shield size={18} />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Privacy &amp; Data Rights (DPO)</h3>
          <p className="text-slate-600 leading-relaxed">
            For GDPR / CCPA data subject access requests, erasure inquiries, or our Data Protection Officer.
          </p>
          <div className="pt-2">
            <span className="font-mono text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200 font-medium">
              privacy@duetmeet.com
            </span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2">
          <div className="h-9 w-9 rounded-lg bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 mb-2">
            <AlertTriangle size={18} />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Security &amp; Vulnerability Reports</h3>
          <p className="text-slate-600 leading-relaxed">
            For coordinated security disclosures or urgent reports regarding signaling or SFU vulnerabilities.
          </p>
          <div className="pt-2">
            <span className="font-mono text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200 font-medium">
              security@duetmeet.com
            </span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2">
          <div className="h-9 w-9 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 mb-2">
            <FileText size={18} />
          </div>
          <h3 className="text-sm font-bold text-slate-900">DMCA &amp; Copyright Infringement</h3>
          <p className="text-slate-600 leading-relaxed">
            To submit a formal Digital Millennium Copyright Act notice or report unauthorized broadcast of protected material.
          </p>
          <div className="pt-2">
            <span className="font-mono text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200 font-medium">
              dmca@duetmeet.com
            </span>
          </div>
        </div>
      </div>

      <section className="space-y-3 pt-4 border-t border-slate-200/80">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Server size={18} className="text-blue-600" /> Self-Hosted &amp; Open Source Deployments
        </h2>
        <p>
          If you are accessing an internal or self-hosted deployment of Duet running on your company&apos;s infrastructure, please contact your internal IT systems administrator or DevOps team for room configuration, TURN server credentials, and network firewall allowlisting.
        </p>
      </section>
    </LegalLayout>
  );
}
