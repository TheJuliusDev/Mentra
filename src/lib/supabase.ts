import { createClient } from "@supabase/supabase-js";

// Check if Supabase env variables are configured
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Initialize Supabase Client if configured
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// User Type interface for our application
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  emailVerified: boolean;
}

// Unified auth client that handles real Supabase API calls or falls back to standard client-side localStorage
export const authClient = {
  // Check if there is an active session
  async getSession(): Promise<AuthUser | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (session && session.user) {
          return {
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.name || session.user.user_metadata?.full_name,
            avatar_url: session.user.user_metadata?.avatar_url,
            created_at: session.user.created_at,
            emailVerified: !!session.user.email_confirmed_at,
          };
        }
      } catch (e) {
        console.error("Supabase getSession error:", e);
      }
    }

    // Fallback: LocalStorage mock session
    const stored = localStorage.getItem("mentra-session");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AuthUser;
        // Default mock user verification to false if they haven't verified yet
        if (parsed && parsed.emailVerified === undefined) {
          parsed.emailVerified = false;
        }
        return parsed;
      } catch {
        return null;
      }
    }
    return null;
  },

  // Listen to auth changes
  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session && session.user) {
          callback({
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.name || session.user.user_metadata?.full_name,
            avatar_url: session.user.user_metadata?.avatar_url,
            created_at: session.user.created_at,
            emailVerified: !!session.user.email_confirmed_at,
          });
        } else {
          callback(null);
        }
      });
      return () => subscription.unsubscribe();
    }

    // Fallback: poll localStorage or trigger via custom event
    const handleStorageChange = () => {
      const stored = localStorage.getItem("mentra-session");
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as AuthUser;
          if (parsed && parsed.emailVerified === undefined) {
            parsed.emailVerified = false;
          }
          callback(parsed);
        } catch {
          callback(null);
        }
      } else {
        callback(null);
      }
    };

    window.addEventListener("mentra-auth-change", handleStorageChange);
    // Initial call
    this.getSession().then(callback);

    return () => {
      window.removeEventListener("mentra-auth-change", handleStorageChange);
    };
  },

  // Create account (Sign Up)
  async signUp(email: string, password: string, name: string): Promise<{ user: AuthUser | null; error: Error | null }> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              full_name: name,
            },
          },
        });
        if (error) throw error;
        if (data.user) {
          const authUser: AuthUser = {
            id: data.user.id,
            email: data.user.email || "",
            name: name,
            created_at: data.user.created_at,
            emailVerified: !!data.user.email_confirmed_at,
          };
          return { user: authUser, error: null };
        }
      } catch (e: any) {
        return { user: null, error: e };
      }
    }

    // Fallback: localStorage simulation
    try {
      const usersRaw = localStorage.getItem("mentra-mock-users") || "[]";
      const users = JSON.parse(usersRaw) as any[];
      
      if (users.some((u) => u.email === email)) {
        throw new Error("User already exists with this email.");
      }

      const mockId = "mock-" + Math.random().toString(36).substr(2, 9);
      const newUser = {
        id: mockId,
        email,
        password, // For simulation
        name,
        created_at: new Date().toISOString(),
        emailVerified: false, // Default to false for verification screen experience!
      };

      users.push(newUser);
      localStorage.setItem("mentra-mock-users", JSON.stringify(users));

      const authUser: AuthUser = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        created_at: newUser.created_at,
        emailVerified: newUser.emailVerified,
      };

      // Set active session
      localStorage.setItem("mentra-session", JSON.stringify(authUser));
      window.dispatchEvent(new Event("mentra-auth-change"));

      return { user: authUser, error: null };
    } catch (e: any) {
      return { user: null, error: e };
    }
  },

  // Log In (Sign In)
  async signIn(email: string, password: string): Promise<{ user: AuthUser | null; error: Error | null }> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) {
          const authUser: AuthUser = {
            id: data.user.id,
            email: data.user.email || "",
            name: data.user.user_metadata?.name || data.user.user_metadata?.full_name,
            avatar_url: data.user.user_metadata?.avatar_url,
            created_at: data.user.created_at,
            emailVerified: !!data.user.email_confirmed_at,
          };
          return { user: authUser, error: null };
        }
      } catch (e: any) {
        return { user: null, error: e };
      }
    }

    // Fallback: localStorage simulation
    try {
      const usersRaw = localStorage.getItem("mentra-mock-users") || "[]";
      const users = JSON.parse(usersRaw) as any[];
      
      const found = users.find((u) => u.email === email && u.password === password);
      if (!found) {
        throw new Error("Invalid email or password.");
      }

      if (found.emailVerified === undefined) {
        found.emailVerified = false; // Give them the verification experience
        users[users.indexOf(found)] = found;
        localStorage.setItem("mentra-mock-users", JSON.stringify(users));
      }

      const authUser: AuthUser = {
        id: found.id,
        email: found.email,
        name: found.name,
        created_at: found.created_at,
        emailVerified: found.emailVerified,
      };

      localStorage.setItem("mentra-session", JSON.stringify(authUser));
      window.dispatchEvent(new Event("mentra-auth-change"));

      return { user: authUser, error: null };
    } catch (e: any) {
      return { user: null, error: e };
    }
  },

  // Sign Out
  async signOut(): Promise<{ error: Error | null }> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      } catch (e: any) {
        return { error: e };
      }
    }

    localStorage.removeItem("mentra-session");
    window.dispatchEvent(new Event("mentra-auth-change"));
    return { error: null };
  },

  // Reset Password for email
  async resetPassword(email: string): Promise<{ success: boolean; error: Error | null }> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + "/#auth",
        });
        if (error) throw error;
        return { success: true, error: null };
      } catch (e: any) {
        return { success: false, error: e };
      }
    }

    // Mock behavior
    try {
      const usersRaw = localStorage.getItem("mentra-mock-users") || "[]";
      const users = JSON.parse(usersRaw) as any[];
      const found = users.some((u) => u.email === email);
      if (!found) {
        console.warn("Mock email not found, but simulating success response for password reset.");
      }
      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: e };
    }
  },

  // Resend signup verification email
  async resendVerificationEmail(email: string): Promise<{ success: boolean; error: Error | null }> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.resend({
          type: "signup",
          email,
        });
        if (error) throw error;
        return { success: true, error: null };
      } catch (e: any) {
        return { success: false, error: e };
      }
    }
    return { success: true, error: null };
  },

  // Reload the current user profile from the database directly
  async reload(): Promise<AuthUser | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (user) {
          const authUser: AuthUser = {
            id: user.id,
            email: user.email || "",
            name: user.user_metadata?.name || user.user_metadata?.full_name,
            avatar_url: user.user_metadata?.avatar_url,
            created_at: user.created_at,
            emailVerified: !!user.email_confirmed_at,
          };
          localStorage.setItem("mentra-session", JSON.stringify(authUser));
          window.dispatchEvent(new Event("mentra-auth-change"));
          return authUser;
        }
      } catch (e) {
        console.error("Supabase reload error:", e);
      }
    }

    // Mock Fallback reload
    const stored = localStorage.getItem("mentra-session");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AuthUser;
        return parsed;
      } catch {
        return null;
      }
    }
    return null;
  },

  // Mark mock user as verified in local simulation
  async setMockVerified(userId: string): Promise<AuthUser | null> {
    try {
      const stored = localStorage.getItem("mentra-session");
      if (stored) {
        const parsed = JSON.parse(stored) as AuthUser;
        if (parsed.id === userId) {
          parsed.emailVerified = true;
          localStorage.setItem("mentra-session", JSON.stringify(parsed));
        }
      }

      const usersRaw = localStorage.getItem("mentra-mock-users") || "[]";
      const users = JSON.parse(usersRaw) as any[];
      const index = users.findIndex((u) => u.id === userId);
      if (index !== -1) {
        users[index].emailVerified = true;
        localStorage.setItem("mentra-mock-users", JSON.stringify(users));
      }

      window.dispatchEvent(new Event("mentra-auth-change"));
      return await this.getSession();
    } catch (e) {
      console.error("Failed to set mock verified:", e);
      return null;
    }
  },
};

// -------------------------------------------------------------
// USER DATA PERSISTENCE MANAGER
// -------------------------------------------------------------

export interface UserData {
  userId: string;
  points: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string | null;
  completedChallenges: string[];
  savedSolutions: Record<string, { code: string; language: string; completedAt: string }>;
  roadmapProgress: string[];
  chatHistory: { role: string; text: string; timestamp: string }[];
  profile: {
    name: string;
    avatar_url: string;
    bio: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
  achievements: string[];
  activityLogs: Record<string, number>; // date "YYYY-MM-DD" -> count of completed challenges
  notifications: { id: string; title: string; desc: string; read: boolean; date: string; type?: string }[];
  hasCompletedTour: boolean;
  notes: { id: string; title: string; body: string; updatedAt: string }[];
  missionTasksChecked: Record<string, boolean>;
}

export const userDataManager = {
  isTableMissing: false,

  // Helper to format dates
  getTodayString(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  },

  getYesterdayString(): string {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  },

  // Get default empty state for a new user
  getDefaultData(userId: string, name: string = "Developer"): UserData {
    return {
      userId,
      points: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
      lastPracticeDate: null,
      completedChallenges: [],
      savedSolutions: {},
      roadmapProgress: [],
      chatHistory: [
        {
          role: "assistant",
          text: "Welcome to your Mentra AI workspace channel! Feel free to ask me questions about AST compilation, optimizing code complexity, or system design architectures.",
          timestamp: new Date().toISOString(),
        }
      ],
      profile: {
        name,
        avatar_url: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(name || "MentraDev")}`,
        bio: "An aspiring developer building foundations on Mentra.",
        github: "",
        twitter: "",
        website: "",
      },
      achievements: [],
      activityLogs: {},
      notifications: [
        {
          id: "welcome",
          title: "Welcome to Mentra!",
          desc: "We are excited to help you master algorithms, data structures, and computer science fundamentals. Get started by solving your first challenge!",
          read: false,
          date: new Date().toISOString(),
          type: "welcome",
        }
      ],
      hasCompletedTour: false,
      notes: [],
      missionTasksChecked: {},
    };
  },

  // Load user data with automatic streak checks
  async loadData(userId: string, name: string = "Developer"): Promise<UserData> {
    let data: UserData | null = null;

    // 1. Try real Supabase database if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbRow, error } = await supabase
          .from("mentra_user_data")
          .select("data")
          .eq("user_id", userId)
          .single();

        if (!error && dbRow && dbRow.data) {
          data = dbRow.data as UserData;
        } else if (error) {
          console.warn("Supabase load error detail:", error);
          const err = error as any;
          if (
            err.code === "42P01" || 
            err.status === 404 || 
            err.message?.includes("not found") || 
            err.message?.includes("does not exist")
          ) {
            this.isTableMissing = true;
            window.dispatchEvent(new CustomEvent("mentra-supabase-error", { detail: error }));
          }
        }
      } catch (e: any) {
        console.warn("Failed to load from Supabase database table 'mentra_user_data':", e);
        if (e && (e.code === "42P01" || e.status === 404 || e.message?.includes("not found") || e.message?.includes("does not exist"))) {
          this.isTableMissing = true;
          window.dispatchEvent(new CustomEvent("mentra-supabase-error", { detail: e }));
        }
      }
    }

    // 2. Fallback to localStorage (or load from localStorage as primary when supabase is mock)
    if (!data) {
      const stored = localStorage.getItem(`mentra_userdata_${userId}`);
      if (stored) {
        try {
          data = JSON.parse(stored) as UserData;
        } catch {
          data = null;
        }
      }
    }

    // 3. Initialize default structure if empty
    if (!data) {
      data = this.getDefaultData(userId, name);
    }

    // Ensure all sub-fields are fully initialized to handle structural migrations
    if (!data.savedSolutions) data.savedSolutions = {};
    if (!data.completedChallenges) data.completedChallenges = [];
    if (!data.roadmapProgress) data.roadmapProgress = [];
    if (!data.chatHistory) data.chatHistory = [];
    if (!data.profile) {
      data.profile = {
        name: name || "Developer",
        avatar_url: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(name || "MentraDev")}`,
        bio: "An aspiring developer building foundations on Mentra.",
      };
    }
    if (!data.achievements) data.achievements = [];
    if (!data.activityLogs) data.activityLogs = {};
    if (!data.notifications) data.notifications = [];
    if (!data.notes) data.notes = [];
    if (!data.missionTasksChecked) data.missionTasksChecked = {};

    // --- Daily Coding Streak Verification ---
    const today = this.getTodayString();
    const yesterday = this.getYesterdayString();

    if (data.lastPracticeDate) {
      if (data.lastPracticeDate !== today && data.lastPracticeDate !== yesterday) {
        // Reset streak because user missed yesterday's session
        data.currentStreak = 0;
      }
    } else {
      data.currentStreak = 0;
    }

    // Save back changes if streak was reset
    await this.saveData(userId, data);

    return data;
  },

  // Save user data
  async saveData(userId: string, data: UserData): Promise<void> {
    // 1. Save to local storage for instant retrieval and offline/local capability
    localStorage.setItem(`mentra_userdata_${userId}`, JSON.stringify(data));

    // 2. Sync to real Supabase database if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from("mentra_user_data").upsert({
          user_id: userId,
          data: data,
          updated_at: new Date().toISOString(),
        });
        if (error) {
          console.warn("Supabase save error detail:", error);
          const err = error as any;
          if (
            err.code === "42P01" || 
            err.status === 404 || 
            err.message?.includes("not found") || 
            err.message?.includes("does not exist")
          ) {
            this.isTableMissing = true;
            window.dispatchEvent(new CustomEvent("mentra-supabase-error", { detail: error }));
          }
        }
      } catch (e: any) {
        // Fail silently or log to debug
        console.warn("Failed to sync userData to Supabase database table 'mentra_user_data':", e);
        if (e && (e.code === "42P01" || e.status === 404 || e.message?.includes("not found") || e.message?.includes("does not exist"))) {
          this.isTableMissing = true;
          window.dispatchEvent(new CustomEvent("mentra-supabase-error", { detail: e }));
        }
      }
    }
  },

  // Record a completed challenge
  async completeChallenge(userId: string, challengeId: string, solutionCode: string, lang: string, pointsEarned: number): Promise<UserData> {
    const data = await this.loadData(userId);

    // Add to completed challenges if not already in there
    if (!data.completedChallenges.includes(challengeId)) {
      data.completedChallenges.push(challengeId);
    }

    // Save code solution
    data.savedSolutions[challengeId] = {
      code: solutionCode,
      language: lang,
      completedAt: new Date().toISOString(),
    };

    // Update streak tracking
    const today = this.getTodayString();
    if (data.lastPracticeDate !== today) {
      if (data.lastPracticeDate === this.getYesterdayString()) {
        data.currentStreak += 1;
      } else {
        data.currentStreak = 1;
      }
      if (data.currentStreak > data.longestStreak) {
        data.longestStreak = data.currentStreak;
      }
      data.lastPracticeDate = today;
    }

    // Increment activity log count for today
    data.activityLogs[today] = (data.activityLogs[today] || 0) + 1;

    // Award XP points
    data.points += pointsEarned;

    // Recalculate level (every 500 XP is 1 level, starting from Level 1)
    const newLevel = Math.floor(data.points / 500) + 1;
    if (newLevel > data.level) {
      data.level = newLevel;
      // Add level-up notification
      data.notifications.unshift({
        id: `level-up-${newLevel}`,
        title: "Level Up! 🎉",
        desc: `Congratulations! You've reached Level ${newLevel} with your coding progress!`,
        read: false,
        date: new Date().toISOString(),
      });
    }

    // Unlock achievement checkpoints
    const unlockedAchievements = [...data.achievements];
    if (data.currentStreak >= 3 && !unlockedAchievements.includes("streak-3")) {
      unlockedAchievements.push("streak-3");
      data.notifications.unshift({
        id: "ach-streak-3",
        title: "Achievement Unlocked! 🔥",
        desc: "3-Day Coding Streak: You are building strong programming habits!",
        read: false,
        date: new Date().toISOString(),
      });
    }
    if (data.completedChallenges.length >= 1 && !unlockedAchievements.includes("first-solved")) {
      unlockedAchievements.push("first-solved");
      data.notifications.unshift({
        id: "ach-first-solved",
        title: "Achievement Unlocked! 🚀",
        desc: "First Step: Solved your very first programming challenge on Mentra!",
        read: false,
        date: new Date().toISOString(),
      });
    }
    if (data.completedChallenges.length >= 5 && !unlockedAchievements.includes("solved-5")) {
      unlockedAchievements.push("solved-5");
      data.notifications.unshift({
        id: "ach-solved-5",
        title: "Achievement Unlocked! 🎓",
        desc: "Algorithm Appraiser: Completed 5 coding challenges!",
        read: false,
        date: new Date().toISOString(),
      });
    }
    data.achievements = unlockedAchievements;

    await this.saveData(userId, data);
    return data;
  }
};

