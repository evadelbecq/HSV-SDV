'use client';

import Link from "next/link"
import api from "@/lib/client/api"
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
    
const Register = () => {

    const auth = useAuth();
    const router = useRouter();
    const formSchema = z.object({
      first_name: z.string().min(1, "Le prénom ne doit pas être vide"),
      last_name: z.string().min(1, "Le nom ne doit pas être vide"),
      phone: z.string().regex(/^\d{10}$/, "Le numéro de téléphone doit contenir 10 chiffres").trim(),
      email: z.string().email("Adresse e-mail invalide").trim(),
      password: z.string().min(1, "Le mot de passe ne doit pas être vide"),
      passwordConfirmation: z.string().min(1, "La confirmation du mot de passe ne doit pas être vide"),
    }).superRefine(({ passwordConfirmation, password }, ctx) => {
      if (passwordConfirmation !== password) {
        ctx.addIssue({
          code: "custom",
          message: "Les mots de passe ne correspondent pas",  
          path: ['passwordConfirmation']
        });
      }
});
    
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        password: "",
        passwordConfirmation: "",
      },
    })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(onSubmit)
    api.register(values)
      .then((response) => {
        auth.login(values.email, values.password)
          .then(() => {
            if (auth.user) {
              console.log("Login successful", auth.user);
              api.createPatient(auth.user.user_id)
              router.replace("/dashboard/patient/list-rdv");
            }
          }
          )
          .catch((error) => {
            // Handle login error
            console.error("Login failed", error);
          }
        );
        console.log("Registration successful", response);
      })
      .catch((error) => {
        // Handle registration error
        console.error("Registration failed", error);
        form.setError("email", {
          type: "manual",
          message: "Cet email est déjà utilisé",
        });
      }
    );
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
          <div className="flex items-center w-2/3 min-h-screen bg-white p-8 rounded-lg shadow-lg">
            <div className="w-full">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-3 gap-3 space-y-8 h-full">
                <h1 className='col-span-3 text-center text-3xl' >Créer un compte</h1>
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Numéro de télephone</FormLabel>
                      <FormControl>
                        <Input placeholder="0732495046" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <PasswordInput placeholder="mot de passe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="passwordConfirmation"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>Confirmer le mot de passe</FormLabel>
                      <FormControl>
                        <PasswordInput placeholder="mot de passe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col items-center gap-3 col-span-3">
                  <Button type="submit">Créer un compte</Button>
                  <Link href="/login" className="underline">Se connecter</Link>
                </div>
 
              </form>
            </Form>
            </div>
          </div>
      </div>
    </div>
  )
}

export default Register
