"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Modal } from "@/components/ui/Modal";
import { projectsApi, uploadApi } from "@/lib/api";
import { useActivityStore, useToastStore } from "@/lib/store";
import { ArrowLeft } from "lucide-react";

export default function ProjectEditorRedirect() {
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/projects?edit=${id}`);
  }, [id, router]);

  return (
    <DashboardLayout>
      <div style={{ width: "100%", maxWidth: "1100px", margin: "0 auto", padding: "40px 0", textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>Redirecting...</p>
      </div>
    </DashboardLayout>
  );
}