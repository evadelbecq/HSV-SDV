'use client';

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import React from 'react'
import Image from 'next/image'
import { useAuth } from '@/lib/client/hooks/useAuth'
import { Button } from "@/components/ui/button"
import formImage from "../../public/assets/form-image.jpg"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"


const Login = () => {
  const auth = useAuth();
  const router = useRouter()
  const formSchema = z.object({
    email: z.string().email("Adresse e-mail invalide"),
    password: z.string().min(1, "Le mot de passe ne doit pas être vide"),
  })
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    auth.login(values.email, values.password)
      .then(() => {
        // Access user from auth context instead of response
        if (auth.user) {
          console.log("Login successful", auth.user);
          
          // Redirect based on user role
          if (auth.user.role === 'patient') {
            router.replace("/dashboard/patient/list-rdv");
          } else if (auth.user.role === 'doctor') {
            router.replace("/dashboard/doctor/appointment-calendar");
          } else {
            router.replace("/dashboard");
          }
        }
      })
      .catch((error) => {
        // Handle login error
        form.setError("email", {
          type: "manual",
          message: "Email ou mot de passe incorrect",
        });
        form.setError("password", {
          type: "manual",
          message: "Email ou mot de passe incorrect",
        });
        console.error("Login failed", error);
      });
  }
  
  
  return (
    <div>
      <div className="fixed inset-0 right-1/3 z-0 bg-gray-900">
        <Image 
          src={formImage} 
          alt="background" 
          fill 
          className="object-cover opacity-80"
          priority
        />
      </div>
      <div className="relative flex z-10 bg-transparent">
          <div className="w-1/3">

          </div>
          <div className="w-2/3 min-h-screen bg-white p-8 rounded-lg shadow-lg">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 h-full flex flex-col justify-center">
                <h1 className='text-center text-3xl' >Connection</h1>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="exemple@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <PasswordInput placeholder="mot de passe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Se connecter</Button>
                <Link href="/register" className="underline">Créer un compte</Link>
              </form>
            </Form>
          </div>
      </div>
    </div>
  )
}

export default Login
