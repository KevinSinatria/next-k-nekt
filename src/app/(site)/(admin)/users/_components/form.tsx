"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserType, RoleType } from "@/types/users";
import { getAllRoles } from "@/services/users";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export const formSchema = z
  .object({
    username: z.string().min(3, { message: "Username minimal 3 karakter." }).max(50),
    password: z.string().min(6, { message: "Password minimal 6 karakter." }).optional().or(z.literal("")),
    fullname: z.string().min(3, { message: "Nama lengkap minimal 3 karakter." }).max(100),
    nip: z.string().optional().or(z.literal("")),
    roleIds: z.array(z.number()).min(1, { message: "Pilih minimal 1 role." }),
  })
  .superRefine((data, ctx) => {
    const isCreate = !data.username || data.password !== undefined;
    void isCreate;
  });

export const createFormSchema = z.object({
  username: z.string().min(3, { message: "Username minimal 3 karakter." }).max(50),
  password: z.string().min(6, { message: "Password minimal 6 karakter." }),
  fullname: z.string().min(3, { message: "Nama lengkap minimal 3 karakter." }).max(100),
  nip: z.string().optional().or(z.literal("")),
  roleIds: z.array(z.number()).min(1, { message: "Pilih minimal 1 role." }),
});

export const editFormSchema = z.object({
  username: z.string().min(3, { message: "Username minimal 3 karakter." }).max(50),
  password: z.string().optional().or(z.literal("")),
  fullname: z.string().min(3, { message: "Nama lengkap minimal 3 karakter." }).max(100),
  nip: z.string().optional().or(z.literal("")),
  roleIds: z.array(z.number()).min(1, { message: "Pilih minimal 1 role." }),
});

export type UsersFormProps = {
  onSubmit?: (values: z.infer<typeof formSchema>) => void;
  initialData?: UserType | null;
  readOnly?: boolean;
  rootPath: string;
};

export function UsersForm({ onSubmit = () => {}, initialData, readOnly, rootPath }: UsersFormProps) {
  const isEdit = !!initialData;
  const schema = isEdit ? editFormSchema : createFormSchema;
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      password: "",
      fullname: "",
      nip: "",
      roleIds: [],
    },
  });

  const router = useRouter();
  const [roles, setRoles] = useState<RoleType[]>([]);

  useEffect(() => {
    getAllRoles()
      .then((res) => setRoles(res.data ?? []))
      .catch(() => setRoles([]));
  }, []);

  useEffect(() => {
    if (initialData) {
      form.setValue("username", initialData.username);
      form.setValue("fullname", initialData.fullname ?? "");
      form.setValue("nip", initialData.nip ?? "");
      form.setValue("roleIds", initialData.roleIds ?? initialData.roles.map((r) => r.id));
      form.setValue("password", "");
    }
  }, [initialData, form]);

  function onCancel() {
    router.push(rootPath);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as never)} className="space-y-6">
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {readOnly ? "Detail Data User" : initialData ? "Edit Data User" : "Tambah User Baru"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500">Username</FormLabel>
                <FormControl>
                  {readOnly ? (
                    <p className="font-medium text-gray-900 dark:text-gray-100 py-2 border-b border-dashed">{field.value || "-"}</p>
                  ) : (
                    <Input placeholder="Username" {...field} />
                  )}
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
                <FormLabel className="text-gray-500">{initialData ? "Password (kosongkan jika tidak diubah)" : "Password"}</FormLabel>
                <FormControl>
                  {readOnly ? (
                    <p className="font-medium text-gray-900 py-2 border-b border-dashed">••••••••</p>
                  ) : (
                    <Input type="password" placeholder={initialData ? "Kosongkan jika tidak diubah" : "Password"} {...field} />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500">Nama Lengkap</FormLabel>
                <FormControl>
                  {readOnly ? (
                    <p className="font-medium text-gray-900 dark:text-gray-100 py-2 border-b border-dashed">{field.value || "-"}</p>
                  ) : (
                    <Input placeholder="Nama Lengkap" {...field} />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nip"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500">NIP (opsional)</FormLabel>
                <FormControl>
                  {readOnly ? (
                    <p className="font-medium text-gray-900 py-2 border-b border-dashed">{field.value || "-"}</p>
                  ) : (
                    <Input placeholder="NIP" {...field} />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="roleIds"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-gray-500">Role</FormLabel>
                <FormControl>
                  {readOnly ? (
                    <div className="flex flex-wrap gap-2 py-2">
                      {(initialData?.roles ?? []).length ? (
                        initialData!.roles.map((r) => (
                          <Badge key={r.id} variant="outline" className="capitalize">
                            {r.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-4 border rounded-lg p-4 bg-white dark:bg-neutral-900">
                      {roles.length === 0 ? (
                        <span className="text-sm text-gray-500">Memuat roles...</span>
                      ) : (
                        roles.map((role) => (
                          <label key={role.id} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={field.value?.includes(role.id)}
                              onCheckedChange={(checked) => {
                                const curr = field.value ?? [];
                                if (checked) field.onChange([...curr, role.id]);
                                else field.onChange(curr.filter((v: number) => v !== role.id));
                              }}
                            />
                            <span className="text-sm capitalize">{role.name}</span>
                          </label>
                        ))
                      )}
                    </div>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          {!readOnly ? (
            <>
              <Button variant="outline" onClick={onCancel} type="button">
                Batal
              </Button>
              <Button className="bg-sky-600 hover:bg-sky-700" type="submit">
                Simpan Data
              </Button>
            </>
          ) : (
            <Button variant="secondary" onClick={onCancel} type="button">
              Tutup Detail
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
