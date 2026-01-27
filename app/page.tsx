"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { ShoppingBag, Store } from "lucide-react";
import { AuthService } from "@/services/AuthService";
import { sessionService } from "@/services/sessionServices";
import { User } from "@/types/user";

export default function AuthPage() {
  const router = useRouter();

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Register state
  const [registerName, setRegisterName] = useState("");
  const [registerPrename, setRegisterPrename] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>();

  useEffect(() => {
    const me = async () => {
      if (sessionStorage.getItem("access_token")) {
        const response = await AuthService.me();
        if (response) {
          sessionService.setUser(response);
          router.push("/admin");

        }
      }
    };
    me();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsLoginLoading(true);
    try {
      const response = await AuthService.login(loginEmail, loginPassword);
      if (response) {
        sessionService.setSessionToken(response.token);
        toast.success("Connexion réussie !");
        const response2 = await AuthService.me();
        if (response2) {
          sessionService.setUser(response2);
        }
        setTimeout(async () => {
          router.push("/admin");
        }, 1000);
      }
    } catch (error) {
      // window.location.reload();
      toast.error("Erreur lors de la connexion");
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !registerName ||
      !registerEmail ||
      !registerPassword ||
      !registerConfirmPassword
    ) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (registerPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setIsRegisterLoading(true);
    try {
      const success = true;
      if (success) {
        toast.success("Inscription réussie !");
        // Redirect based on role
      }
    } catch (error) {
      toast.error("Erreur lors de l'inscription");
    } finally {
      setIsRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Bienvenue sur ABAZED</CardTitle>
            <p>Connectez-vous ou créez un compte pour continuer</p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="exemple@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>

                  {/* <div className="space-y-3">
                    <Label>Je me connecte en tant que</Label>
                    <RadioGroup value={loginRole} onValueChange={(value) => setLoginRole(value as UserRole)}>
                      <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-secondary/50">
                        <RadioGroupItem value="buyer" id="login-buyer" />
                        <Label htmlFor="login-buyer" className="flex items-center gap-2 cursor-pointer flex-1">
                          <ShoppingBag className="h-4 w-4" />
                          <div>
                            <p className="font-medium">Acheteur</p>
                            <p className="text-xs text-muted-foreground">Acheter des produits</p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-secondary/50">
                        <RadioGroupItem value="seller" id="login-seller" />
                        <Label htmlFor="login-seller" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Store className="h-4 w-4" />
                          <div>
                            <p className="font-medium">Vendeur</p>
                            <p className="text-xs text-muted-foreground">Vendre mes produits</p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div> */}

                  <Button
                    type="submit"
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    disabled={isLoginLoading}
                  >
                    {isLoginLoading ? "Connexion..." : "Se connecter"}
                  </Button>

                  <div className="text-center text-sm">
                    <Link
                      href="/auth/forgot-password"
                      className="text-primary hover:underline"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>
                </form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2 flex-col gap-2">
                    <Label htmlFor="register-name">Nom </Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Jean "
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                    />
                    <Label htmlFor="register-name">Prenom</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder=" Dupont"
                      value={registerName}
                      onChange={(e) => setRegisterPrename(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="exemple@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Mot de passe</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">
                      Confirmer le mot de passe
                    </Label>
                    <Input
                      id="register-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerConfirmPassword}
                      onChange={(e) =>
                        setRegisterConfirmPassword(e.target.value)
                      }
                      required
                    />
                  </div>

                  {/* <div className="space-y-3">
                    <Label>Je m'inscris en tant que</Label>
                    <RadioGroup value={registerRole} onValueChange={(value) => setRegisterRole(value as UserRole)}>
                      <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-secondary/50">
                        <RadioGroupItem value="buyer" id="register-buyer" />
                        <Label htmlFor="register-buyer" className="flex items-center gap-2 cursor-pointer flex-1">
                          <ShoppingBag className="h-4 w-4" />
                          <div>
                            <p className="font-medium">Acheteur</p>
                            <p className="text-xs text-muted-foreground">Acheter des produits</p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-secondary/50">
                        <RadioGroupItem value="seller" id="register-seller" />
                        <Label htmlFor="register-seller" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Store className="h-4 w-4" />
                          <div>
                            <p className="font-medium">Vendeur</p>
                            <p className="text-xs text-muted-foreground">Vendre mes produits</p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div> */}

                  <Button
                    type="submit"
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    disabled={isRegisterLoading}
                  >
                    {isRegisterLoading ? "Inscription..." : "S'inscrire"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    En vous inscrivant, vous acceptez nos{" "}
                    <Link
                      href="/terms"
                      className="text-primary hover:underline"
                    >
                      conditions générales
                    </Link>{" "}
                    et notre{" "}
                    <Link
                      href="/privacy"
                      className="text-primary hover:underline"
                    >
                      politique de confidentialité
                    </Link>
                    .
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
