import { redirect } from "next/navigation";

// the journey is the home page now
export default function JourneyRedirect() {
  redirect("/");
}
