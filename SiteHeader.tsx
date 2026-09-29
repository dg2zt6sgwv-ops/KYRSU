import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/Wordmark";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/use-auth";
import { assetUrl } from "@/lib/base-path";
import { clearGuestSessionFlag } from "@/components/GuestSessionKeeper";
import { Download, LogIn, LogOut } from "lucide-react";
import { useNavigate } from "react-router";

export function SiteHeader() {
  const { isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    clearGuestSessionFlag();
    try {
      await signOut();
    } finally {
      navigate("/");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 rounded-md px-1 py-1"
        >
          <Wordmark />
        </button>
        <div className="flex items-center gap-1.5">
          <a
            href={assetUrl("soogy.zip")}
            download
            title="Скачать исходники проекта (zip)"
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border/60 px-3 font-editor text-xs transition-colors hover:bg-accent"
          >
            <Download className="size-3.5" />
            Скачать
          </a>
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="font-editor text-xs"
                onClick={() => navigate("/dashboard")}
              >
                ~/курсы
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 font-editor text-xs"
                onClick={handleSignOut}
              >
                <LogOut className="size-3.5" />
                Выйти
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              className="gap-1.5 font-editor text-xs"
              onClick={() => navigate("/auth?returnTo=%2Fdashboard")}
            >
              <LogIn className="size-3.5" />
              Начать бесплатно
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
