export function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() ?? null;
  }
  return null;
}

// React ARIA utility components
export {
  Text,
  Header,
  Group,
  Section,
  Label,
  Separator,
} from "react-aria-components";
