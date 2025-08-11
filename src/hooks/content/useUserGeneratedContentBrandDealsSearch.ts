// src/hooks/useFreeUserGeneratedContentBrandDealsSearch.ts
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type UserGeneratedContentBrandDealLead = {
  identifier: string;
  brandName: string;
  roleTitle: string;
  applicationLink: string;
  postedAtCoordinatedUniversalTime?: string;
  locationDisplay?: string;
  platformHint?: 'TikTok' | 'Instagram' | 'YouTube' | 'General';
};

type HookState =
  | { status: 'idle'; leads: UserGeneratedContentBrandDealLead[]; error?: undefined }
  | { status: 'loading'; leads: UserGeneratedContentBrandDealLead[]; error?: undefined }
  | { status: 'success'; leads: UserGeneratedContentBrandDealLead[]; error?: undefined }
  | { status: 'error'; leads: UserGeneratedContentBrandDealLead[]; error: Error };

type Options = {
  backendEndpoint: string; // kept for compatibility, not used
  additionalKeywords?: string[]; // ignored by design now
  shouldFetchOnMount?: boolean;
  requestTimeoutInMilliseconds?: number;
};

const REMOTIVE_ENDPOINT = 'https://remotive.com/api/remote-jobs';

// ---- Helpers ----
function stripHtml(html?: string): string {
  return (html || '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeText(input: string): string {
  return (input || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function matchesAny(patterns: RegExp[], text: string): boolean {
  return patterns.some((re) => re.test(text));
}

function determinePlatformFromText(text: string): 'TikTok' | 'Instagram' | 'YouTube' | 'General' {
  const normalized = normalizeText(text);
  if (/\btiktok\b|\bspark ads\b/.test(normalized)) return 'TikTok';
  if (/\binstagram\b|\big\b|\breels\b|\bstories\b/.test(normalized)) return 'Instagram';
  if (/\byoutube\b|\byt\b|\bshorts\b/.test(normalized)) return 'YouTube';
  return 'General';
}

// High-precision include patterns (title-first)
const TITLE_INCLUDE_PATTERNS: RegExp[] = [
  /\bugc\b/i,
  /\buser[- ]generated content\b/i,
  /\bcontent creator\b/i,
  // Social media roles with content responsibilities
  /\bsocial media\b.*\b(content|coordinator|manager|specialist|producer|editor)\b/i,
  // Influencer/creator operational roles
  /\b(influencer|creator)\b.*\b(manager|marketing|coordinator)\b/i,
  // Email marketing roles (explicitly allow, per examples)
  /\bemail\b.*\b(campaign|marketing)\b.*\b(manager|specialist|coordinator|strategist)\b/i,
  // Short-form deliverables
  /\bshort[- ]form\b.*\b(video|content)\b/i,
];

// Hard excludes (title)
const TITLE_EXCLUDE_PATTERNS: RegExp[] = [
  /\b(recruiter|recruiting|talent|hr)\b/i,
  /\b(account executive|sales|business development|partnerships?)\b/i,
  /\b(engineer|developer|devops|sre|data engineer|ml engineer|support engineer)\b/i,
  /\b(designer|design|product designer|graphic designer|artworker)\b/i,
  /\b(copywriter|writer)\b/i,
  /\b(seo)\b/i,
  /\b(affiliate manager|affiliate)\b/i,
  /\b(intern|internship)\b/i,
  /\b(assessor)\b/i,
];

export function userGeneratedContentBrandDealsSearch({
  backendEndpoint, // not used
  additionalKeywords, // intentionally ignored
  shouldFetchOnMount = true,
  requestTimeoutInMilliseconds = 15000,
}: Options) {
  const [state, setState] = useState<HookState>({ status: 'idle', leads: [] });
  const isFetchInProgressRef = useRef(false);

  const createAbortControllerWithTimeout = useCallback((timeoutInMilliseconds: number) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutInMilliseconds);
    return { controller, dispose: () => clearTimeout(timer) };
  }, []);

  const refresh = useCallback(async () => {
    if (isFetchInProgressRef.current) return;
    isFetchInProgressRef.current = true;
    setState((prev) => ({ status: 'loading', leads: prev.leads, error: undefined }));

    const { controller, dispose } = createAbortControllerWithTimeout(requestTimeoutInMilliseconds);

    try {
      const response = await fetch(REMOTIVE_ENDPOINT, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Remotive API error ${response.status}: ${text}`);
      }

      const body = await response.json();
      const jobs: any[] = Array.isArray(body?.jobs) ? body.jobs : [];

      // Precise, title-first filtering
      const filtered = jobs.filter((job) => {
        const title: string = job?.title || '';
        const normalizedTitle = normalizeText(title);

        if (!matchesAny(TITLE_INCLUDE_PATTERNS, normalizedTitle)) return false;
        if (matchesAny(TITLE_EXCLUDE_PATTERNS, normalizedTitle)) return false;

        return true;
      });

      // Map to required shape with safe fallbacks
      const leads: UserGeneratedContentBrandDealLead[] = filtered.map((job) => {
        const title: string = job?.title || 'Content Creator / UGC';
        const company: string = job?.company_name || 'Unknown Company';
        const url: string = job?.url || '#';
        const publication = job?.publication_date;
        const location = job?.candidate_required_location || 'Remote';

        const descriptionPlain = stripHtml(job?.description || '');
        const platformHint = determinePlatformFromText(`${title} ${descriptionPlain}`);

        return {
          identifier: job?.id ? String(job.id) : `${company}-${title}-${url}`,
          brandName: company,
          roleTitle: title,
          applicationLink: url,
          postedAtCoordinatedUniversalTime: publication ? new Date(publication).toISOString() : undefined,
          locationDisplay: location,
          platformHint,
        };
      });

      // Sort newest first
      leads.sort((a, b) => {
        const aTime = a.postedAtCoordinatedUniversalTime ? Date.parse(a.postedAtCoordinatedUniversalTime) : 0;
        const bTime = b.postedAtCoordinatedUniversalTime ? Date.parse(b.postedAtCoordinatedUniversalTime) : 0;
        return bTime - aTime;
      });

      setState({ status: 'success', leads });
    } catch (error: any) {
      setState((prev) => ({ status: 'error', leads: prev.leads ?? [], error }));
    } finally {
      dispose();
      isFetchInProgressRef.current = false;
    }
  }, [requestTimeoutInMilliseconds, createAbortControllerWithTimeout]);

  useEffect(() => {
    if (shouldFetchOnMount) {
      refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldFetchOnMount]);

  return {
    ...state,
    refresh,
    hasAnyResults: state.leads.length > 0,
  };
}
