// import { supabase } from "@/lib/supabase";
// import { Session, User } from "@supabase/supabase-js";
// import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

// type AuthContext = {
//   session: Session | null;
//   user: User | null;
// };

// const AuthContext = createContext<AuthContext>({
//   session: null,
//   user: null,
// });

// export default function AuthProvider({ children }: PropsWithChildren) {
//   const [session, setSession] = useState<Session | null>(null);

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session);
//     });

//     supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session);
//     });
//   }, []);

//   return (
//     <AuthContext.Provider value={{ session, user: session?.user }}>{children}</AuthContext.Provider>
//   );
// }

// // useAuth <- will be used for auth
// export const useAuth = () => {
//   return useContext(AuthContext);
// };

import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { ActivityIndicator, Text } from "react-native";

type AuthContext = {
  session: Session | null;
  user: User | null;
};

const AuthContext = createContext<AuthContext>({
  session: null,
  user: null,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [promptLogin, setPromptLogin] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(data.session);
      } catch (error) {
        console.error("Error fetching session:", error);
        if (error.message.includes("Invalid Refresh Token: Refresh Token Not Found")) {
          setPromptLogin(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || event === "TOKEN_REFRESH_FAILED") {
        setSession(null);
        if (event === "TOKEN_REFRESH_FAILED") {
          console.error("Token refresh failed.");
          setPromptLogin(true);
        }
      } else {
        setSession(session);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  if (promptLogin) {
    return (
      <>
        <Text>
          Your session has expired. Please <a href="/login">log in</a> again.
        </Text>
      </>
    );
  }

  return (
    <AuthContext.Provider value={{ session, user: session?.user }}>{children}</AuthContext.Provider>
  );
}

// useAuth <- will be used for auth
export const useAuth = () => {
  return useContext(AuthContext);
};
