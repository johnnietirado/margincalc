import { FacebookIcon, GitHubIcon, GoogleIcon } from "@/components/socials"; // Import other icons
import { cn } from "@/lib/utils";
import { providerMap, signIn } from "@/server/auth";
import { WebAuthnVerificationError } from "@auth/core/errors";
import { redirect } from "next/navigation";

const socialProviderColors: Record<string, string> = {
  google: "bg-[#DB4437]", // Google color
  facebook: "bg-[#3B5998]", // Facebook color
  github: "bg-[#000000]", // GitHub color
  // Add more providers and their corresponding colors
};

export function ProvidersLogin() {
  return (
    <div className="mx-auto w-full max-w-md space-y-2">
      <div className="flex flex-col gap-4">
        {Object.values(providerMap).map((provider) => {
          const buttonColor =
            socialProviderColors[provider.id] ?? "bg-gray-200"; // Default color
          let IconComponent;

          // Determine the icon component based on the provider
          switch (provider.id) {
            case "google":
              IconComponent = GoogleIcon;
              break;
            case "facebook":
              IconComponent = FacebookIcon;
              break;
            case "github":
              IconComponent = GitHubIcon;
              break;
            default:
              IconComponent = null; // No icon for unknown providers
          }

          return (
            <form
              key={provider.id}
              action={async () => {
                "use server";
                try {
                  await signIn(provider.id);
                } catch (error) {
                  if (error instanceof WebAuthnVerificationError) {
                    return redirect(`/sign-in?error=${error.type}`);
                  }
                  throw error;
                }
              }}
            >
              <button
                type="submit"
                className={cn(
                  `flex h-9 w-full items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${buttonColor} text-base text-white`
                )}
              >
                {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
                Sign in with {provider.name}
              </button>
            </form>
          );
        })}
      </div>
    </div>
  );
}
