import { redirect } from "next/navigation";
import config from "@/config";
import { createClient } from "@/utils/supabase/server";
import ButtonAccount from "@/components/ButtonAccount";

// This is a server-side component to ensure the user is logged in.
// If not, it will redirect to the login page.
// It's applied to all subpages of /dashboard in /app/dashboard/*** pages
// You can also add custom static UI elements like a Navbar, Sidebar, Footer, etc..
// See https://shipfa.st/docs/tutorials/private-page
export default async function LayoutPrivate({ children }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(config.auth.loginUrl);
  }

  return (
    <div className="max-w-[1440px] px-2 md:px-16 py-8 mx-auto">
      <div className="flex justify-between items-center mb-16">
        <ButtonAccount />
      </div>

      {children}
    </div>
  );
}
