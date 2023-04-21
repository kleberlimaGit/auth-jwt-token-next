import { AuthContext } from "@/contexts/AuthContext";
import { validateUserPermissions } from "@/utils/validateUserPermissions";
import { useContext } from "react";
import { useContextSelector } from "use-context-selector";

interface UseCanParam {
  permissions?: string[] | null;
  roles?: string[] | null;
}

export function useCan({ permissions = [], roles = [] }: UseCanParam) {
  const { isAuthenticated, user } = useContextSelector(
    AuthContext,
    (context) => {
      return {
        isAuthenticated: context.isAuthenticated,
        user: context.user,
      };
    }
  );

  if (!isAuthenticated) {
    return false;
  }
  if (user) {
    const userHasValidPermissions = validateUserPermissions({
      user,
      permissions,
      roles,
    });
  }
}
