import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useRef } from "react";

const GUEST_FLAG = "soogy:guest-session";

function setGuestFlag() {
  try {
    localStorage.setItem(GUEST_FLAG, "1");
  } catch {
    // ignore
  }
}

function clearGuestFlag() {
  try {
    localStorage.removeItem(GUEST_FLAG);
  } catch {
    // ignore
  }
}

function hasGuestFlag(): boolean {
  try {
    return localStorage.getItem(GUEST_FLAG) === "1";
  } catch {
    return false;
  }
}

/** Вызывать при явном выходе из аккаунта (иначе хранитель вернёт гостя). */
export function clearGuestSessionFlag() {
  clearGuestFlag();
}

let reauthInProgress = false;

/**
 * Хранитель гостевой сессии.
 *
 * Анонимная сессия Convex хранится в localStorage; в превью-iframe или при
 * перезапуске окружения она может «потеряться», и тогда гостя выкидывало на
 * экран входа. Теперь: если пользователь был гостем и сессия пропала — тихо
 * создаём новую гостевую сессию, сохраняя ощущение «аккаунт на месте».
 * Явный выход (кнопка «Выйти») сбрасывает флаг — автологин не срабатывает.
 */
export function GuestSessionKeeper() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { signIn } = useAuthActions();
  const user = useQuery(api.users.currentUser);
  const triedRef = useRef(false);

  // Запоминаем «этот браузер был гостем».
  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.isAnonymous) {
      setGuestFlag();
    }
  }, [isLoading, isAuthenticated, user]);

  // Восстанавливаем гостя, если сессия пропала.
  useEffect(() => {
    if (isLoading || isAuthenticated || triedRef.current || reauthInProgress) {
      return;
    }
    if (!hasGuestFlag()) return;
    triedRef.current = true;
    reauthInProgress = true;
    signIn("anonymous")
      .catch(() => clearGuestFlag())
      .finally(() => {
        reauthInProgress = false;
      });
  }, [isLoading, isAuthenticated, signIn]);

  return null;
}
