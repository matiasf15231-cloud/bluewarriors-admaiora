"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import googleLogo from '@/assets/google.png';
import logo from '@/assets/bluewarriors-logo.png';

const signUpSchema = z.object({
  firstName: z.string().min(1, { message: "El nombre es requerido" }),
  lastName: z.string().min(1, { message: "El apellido es requerido" }),
  email: z.string().email({ message: "Correo electrónico inválido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

const signInSchema = z.object({
  email: z.string().email({ message: "Correo electrónico inválido" }),
  password: z.string().min(1, { message: "La contraseña es requerida" }),
});

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { session, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "" },
  });

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  async function handleGoogleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  }

  async function onSignUpSubmit(values: z.infer<typeof signUpSchema>) {
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          first_name: values.firstName,
          last_name: values.lastName,
        }
      }
    });
    if (error) {
      toast({ title: "Error al registrarse", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "¡Éxito!", description: "Por favor, revisa tu correo para verificar tu cuenta." });
      setIsSignUp(false);
    }
  }

  async function onSignInSubmit(values: z.infer<typeof signInSchema>) {
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      toast({ title: "Error al iniciar sesión", description: error.message, variant: "destructive" });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-section">
        <div className="w-full max-w-md p-8 space-y-4">
          <Skeleton className="h-12 w-12 mx-auto" />
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-5 w-1/2 mx-auto" />
          <div className="space-y-6 pt-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (session) {
    return <Navigate to={from} replace />;
  }

  const isSubmitting = signInForm.formState.isSubmitting || signUpForm.formState.isSubmitting;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-section p-4">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-lg pb-0">
          <CardHeader className="flex flex-col items-center space-y-1.5 pb-4 pt-6 text-center">
            <img src={logo} alt="BlueWarriors Logo" className="w-48" />
            <div className="space-y-0.5 flex flex-col items-center">
              <h2 className="text-2xl font-semibold text-foreground">
                {isSignUp ? "Crea una cuenta" : "Inicia Sesión"}
              </h2>
              <p className="text-muted-foreground">
                {isSignUp ? "¡Bienvenido! Crea una cuenta para empezar." : "¡Bienvenido de nuevo!"}
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 px-8">
            {isSignUp ? (
              <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={signUpForm.control} name="firstName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl><Input {...field} disabled={isSubmitting} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={signUpForm.control} name="lastName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellido</FormLabel>
                        <FormControl><Input {...field} disabled={isSubmitting} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={signUpForm.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo electrónico</FormLabel>
                      <FormControl><Input type="email" {...field} disabled={isSubmitting} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={signUpForm.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type={showPassword ? "text" : "password"} className="pr-10" {...field} disabled={isSubmitting} />
                          <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {signUpForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Crear cuenta gratis
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-4">
                  <FormField control={signInForm.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo electrónico</FormLabel>
                      <FormControl><Input type="email" {...field} disabled={isSubmitting} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={signInForm.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type={showPassword ? "text" : "password"} className="pr-10" {...field} disabled={isSubmitting} />
                          <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {signInForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Iniciar Sesión
                  </Button>
                </form>
              </Form>
            )}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">O continuar con</span>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isSubmitting}>
              <img src={googleLogo} alt="Google" className="mr-2 h-4 w-4" />
              Google
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center border-t !py-4">
            <p className="text-center text-sm text-muted-foreground">
              {isSignUp ? "¿Ya tienes una cuenta? " : "¿No tienes una cuenta? "}
              <button onClick={() => { setIsSignUp(!isSignUp); signInForm.reset(); signUpForm.reset(); }} className="font-semibold text-primary hover:underline" disabled={isSubmitting}>
                {isSignUp ? "Inicia sesión" : "Regístrate"}
              </button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;