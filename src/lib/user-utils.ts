/**
 * Get the initials from a user's name.
 * @param name The user's full name
 * @returns The initials (up to 2 characters)
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  const names = name.trim().split(" ");
  if (names.length === 1) return names[0]?.charAt(0)?.toUpperCase() ?? "?";

  const firstInitial = names[0]?.charAt(0) ?? "";
  const lastInitial = names[names.length - 1]?.charAt(0) ?? "";
  return (firstInitial + lastInitial).toUpperCase() || "?";
}
