import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import * as repo from '@/data/repository';
import type { Locale, PujariProfile, ServiceType, VerificationStage } from '@/data/types';

/**
 * Session store — the pujari's identity, application draft, and app-level
 * preferences. Deliberately thin: screens read domain data through the
 * repository, not through here.
 */

export type ApplicationDraft = {
  fullName: string;
  dateOfBirth: string;
  altPhone: string;
  email: string;
  yearsExperience: number;
  trainingType: string[];
  guruOrInstitution: string;
  templeServed: string;
  vedas: string[];
  sampradaya: string[];
  languages: string[];
  poojaIds: string[];
  serviceType: ServiceType;
  zoneId: string;
  travelRadiusKm: number;
  accountNumber: string;
  confirmAccountNumber: string;
  ifsc: string;
  holderName: string;
};

export const APPLICATION_STEPS = 5;

const emptyDraft: ApplicationDraft = {
  fullName: '',
  dateOfBirth: '',
  altPhone: '',
  email: '',
  yearsExperience: 2,
  trainingType: [],
  guruOrInstitution: '',
  templeServed: '',
  vedas: [],
  sampradaya: [],
  languages: [],
  poojaIds: [],
  serviceType: 'home_visit',
  zoneId: '',
  travelRadiusKm: 10,
  accountNumber: '',
  confirmAccountNumber: '',
  ifsc: '',
  holderName: '',
};

/**
 * The wizard tells the applicant their progress is saved after every step, so
 * it has to actually be true — killing the app or reloading must lose nothing.
 */
const DRAFT_KEY = 'sankalpam.pujari.draft';

function loadDraft(): ApplicationDraft {
  try {
    const raw = globalThis.localStorage?.getItem(DRAFT_KEY);
    return raw ? { ...emptyDraft, ...(JSON.parse(raw) as Partial<ApplicationDraft>) } : emptyDraft;
  } catch {
    return emptyDraft;
  }
}

function saveDraft(d: ApplicationDraft) {
  try {
    globalThis.localStorage?.setItem(DRAFT_KEY, JSON.stringify(d));
  } catch {
    /* storage unavailable — the wizard still works within the session */
  }
}

type Toast = { id: number; message: string; tone: 'success' | 'error' | 'info' } | null;

type Ctx = {
  profile: PujariProfile | null;
  loading: boolean;
  locale: Locale;
  setLocale: (l: Locale) => void;
  offline: boolean;
  setOffline: (v: boolean) => void;

  draft: ApplicationDraft;
  /** Saves after every step — killing the app must lose nothing. */
  patchDraft: (patch: Partial<ApplicationDraft>) => void;

  refreshProfile: () => Promise<void>;
  signIn: (phone: string) => Promise<PujariProfile>;
  advance: (stage: VerificationStage) => Promise<void>;
  jump: (stage: VerificationStage) => Promise<void>;

  toast: Toast;
  showToast: (message: string, tone?: 'success' | 'error' | 'info') => void;
};

const SessionCtx = createContext<Ctx | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<PujariProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState<Locale>('en');
  const [offline, setOfflineState] = useState(false);
  const [draft, setDraft] = useState<ApplicationDraft>(loadDraft);
  const [toast, setToast] = useState<Toast>(null);

  useEffect(() => {
    void (async () => {
      const p = await repo.getProfile();
      setProfile(p);
      setLoading(false);
    })();
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      setProfile(await repo.getProfile());
    } catch {
      /* offline — keep last known profile, the UI shows the banner */
    }
  }, []);

  const showToast = useCallback((message: string, tone: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToast({ id, message, tone });
    setTimeout(() => setToast((t) => (t?.id === id ? null : t)), 3200);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      profile,
      loading,
      locale,
      setLocale,
      offline,
      setOffline: (v: boolean) => {
        repo.connectivity.set(v);
        setOfflineState(v);
      },
      draft,
      patchDraft: (patch) =>
        setDraft((d) => {
          const next = { ...d, ...patch };
          saveDraft(next);
          return next;
        }),
      refreshProfile,
      signIn: async (phone: string) => {
        const p = await repo.resetTo('new', phone);
        setProfile(p);
        setDraft(emptyDraft);
        saveDraft(emptyDraft);
        return p;
      },
      advance: async (stage) => {
        setProfile(await repo.advanceStage(stage));
      },
      jump: async (stage) => {
        setProfile(await repo.jumpToStage(stage));
      },
      toast,
      showToast,
    }),
    [profile, loading, locale, offline, draft, refreshProfile, toast, showToast],
  );

  return <SessionCtx.Provider value={value}>{children}</SessionCtx.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionCtx);
  if (!ctx) throw new Error('useSession must be used inside <SessionProvider>');
  return ctx;
}

/** Where a given verification stage should land the user. */
export function routeForStage(stage: VerificationStage): string {
  switch (stage) {
    case 'not_started':
      return '/apply/intro';
    case 'active':
      return '/(tabs)';
    case 'rejected':
      return '/verification';
    default:
      return '/verification';
  }
}

export const STAGE_INDEX: Record<string, number> = {
  submitted: 1,
  under_review: 1,
  docs_rejected: 1,
  stage1_cleared: 2,
  stage2_scheduling: 2,
  stage2_scheduled: 2,
  stage2_passed: 3,
  stage3_scheduling: 3,
  stage3_scheduled: 3,
  stage3_passed: 4,
  stage4_agreement: 4,
  stage4_profile: 4,
  active: 5,
};
