"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Globe, Loader2 } from "lucide-react";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { toast } from "sonner";

import { AvatarUploader } from "@/components/profile/avatar-uploader";
import { ProfilePreviewCard } from "@/components/profile/profile-preview-card";
import { SkillsPicker } from "@/components/profile/skills-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  EXPERIENCE_LEVEL_OPTIONS,
  GENDER_OPTIONS,
  STATE_OPTIONS,
} from "@/lib/constants/profile-options";
import { editProfileSchema, type ProfileFormValues } from "@/lib/validation/profileSchemas";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { editProfile } from "@/store/slices/authSlice";
import type { User } from "@/types";

function toDefaultValues(user: User | null): ProfileFormValues {
  return {
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    age: user?.age != null ? String(user.age) : "",
    gender: user?.gender ?? "",
    experienceLevel: user?.experienceLevel ?? "fresher",
    bio: user?.bio ?? "",
    skills: user?.skills ?? [],
    state: user?.location?.state ?? "",
    country: user?.location?.country ?? "India",
    githubUrl: user?.githubUrl ?? "",
    linkedinUrl: user?.linkedinUrl ?? "",
    twitterUrl: user?.twitterUrl ?? "",
    portfolioUrl: user?.portfolioUrl ?? "",
  };
}

export function ProfileForm() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const status = useAppSelector((state) => state.auth.status);
  const isSubmitting = status === "loading";

  const [photoFile, setPhotoFile] = useState<File | undefined>(undefined);
  const [photoPreview, setPhotoPreview] = useState<string | null>(user?.photo ?? null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: toDefaultValues(user),
    mode: "onChange",
  });

  const formValues = watch();

  const onSubmit = async (data: ProfileFormValues) => {
    const result = await dispatch(
      editProfile({
        firstName: data.firstName,
        lastName: data.lastName || undefined,
        age: data.age ? Number(data.age) : null,
        gender: data.gender || null,
        bio: data.bio,
        experienceLevel: data.experienceLevel || null,
        skills: data.skills,
        location: { state: data.state, country: data.country ?? "India" },
        photo: photoFile,
        githubUrl: data.githubUrl || null,
        linkedinUrl: data.linkedinUrl || null,
        twitterUrl: data.twitterUrl || null,
        portfolioUrl: data.portfolioUrl || null,
      })
    );

    if (editProfile.fulfilled.match(result)) {
      toast.success("Profile updated successfully");
    } else {
      toast.error((result.payload as string) ?? "Update failed");
    }
  };

  return (
    <div className="flex flex-col items-start gap-6 lg:flex-row">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="glass w-full flex-1 rounded-lg p-6 shadow-xl shadow-black/20 lg:p-8"
      >
        <div className="mb-6 border-b border-white/10 pb-4">
          <h2 className="text-h2">Edit profile</h2>
          <p className="text-muted-foreground text-sm">Update your details below.</p>
        </div>

        <div className="flex flex-col gap-8">
          <AvatarUploader
            initialsFallback={`${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase()}
            existingPhoto={user?.photo}
            onFileSelected={(file, preview) => {
              setPhotoFile(file);
              setPhotoPreview(preview);
            }}
          />

          <section>
            <h3 className="mb-3 text-sm font-semibold">Personal details</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label>DevTinder ID</Label>
                <Input value={user?.uniqueId ?? ""} disabled />
              </div>
              <div className="grid gap-1.5">
                <Label>Email</Label>
                <Input value={user?.emailId ?? ""} disabled />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" {...register("firstName")} />
                {errors.firstName && (
                  <p className="text-destructive text-xs">{errors.firstName.message}</p>
                )}
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" {...register("lastName")} />
                {errors.lastName && (
                  <p className="text-destructive text-xs">{errors.lastName.message}</p>
                )}
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" {...register("age")} />
                {errors.age && <p className="text-destructive text-xs">{errors.age.message}</p>}
              </div>
              <div className="grid gap-1.5">
                <Label>Gender</Label>
                <Controller
                  control={control}
                  name="gender"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {GENDER_OPTIONS.map((g) => (
                          <SelectItem key={g.id} value={g.id}>
                            {g.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="grid gap-1.5">
                <Label>State</Label>
                <Controller
                  control={control}
                  name="state"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATE_OPTIONS.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.state && <p className="text-destructive text-xs">{errors.state.message}</p>}
              </div>
              <div className="grid gap-1.5">
                <Label>Country</Label>
                <Input value="India" disabled />
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold">Professional info</h3>
            <div className="flex flex-col gap-4">
              <div className="grid gap-1.5">
                <Label>Experience level</Label>
                <Controller
                  control={control}
                  name="experienceLevel"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPERIENCE_LEVEL_OPTIONS.map((l) => (
                          <SelectItem key={l.id} value={l.id}>
                            {l.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Skills</Label>
                <Controller
                  control={control}
                  name="skills"
                  render={({ field }) => <SkillsPicker value={field.value} onChange={field.onChange} />}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  placeholder="Tell us about yourself…"
                  {...register("bio")}
                />
                {errors.bio && <p className="text-destructive text-xs">{errors.bio.message}</p>}
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="mb-3 text-sm font-semibold">Social presence</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label className="flex items-center gap-1.5">
                  <FaGithub className="size-3.5" /> GitHub URL
                </Label>
                <Input placeholder="https://github.com/…" {...register("githubUrl")} />
                {errors.githubUrl && (
                  <p className="text-destructive text-xs">{errors.githubUrl.message}</p>
                )}
              </div>
              <div className="grid gap-1.5">
                <Label className="flex items-center gap-1.5">
                  <FaLinkedin className="size-3.5" /> LinkedIn URL
                </Label>
                <Input placeholder="https://linkedin.com/…" {...register("linkedinUrl")} />
                {errors.linkedinUrl && (
                  <p className="text-destructive text-xs">{errors.linkedinUrl.message}</p>
                )}
              </div>
              <div className="grid gap-1.5">
                <Label className="flex items-center gap-1.5">
                  <FaXTwitter className="size-3.5" /> Twitter URL
                </Label>
                <Input placeholder="https://twitter.com/…" {...register("twitterUrl")} />
                {errors.twitterUrl && (
                  <p className="text-destructive text-xs">{errors.twitterUrl.message}</p>
                )}
              </div>
              <div className="grid gap-1.5">
                <Label className="flex items-center gap-1.5">
                  <Globe className="size-3.5" /> Portfolio URL
                </Label>
                <Input placeholder="https://myportfolio.com" {...register("portfolioUrl")} />
                {errors.portfolioUrl && (
                  <p className="text-destructive text-xs">{errors.portfolioUrl.message}</p>
                )}
              </div>
            </div>
          </section>

          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            Save changes
          </Button>
        </div>
      </form>

      <div className="w-full lg:sticky lg:top-4 lg:w-80 lg:shrink-0">
        <ProfilePreviewCard
          data={{
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            age: formValues.age,
            bio: formValues.bio,
            skills: formValues.skills,
            state: formValues.state,
            photoPreview,
            isPremium: user?.isPremium,
            githubUrl: formValues.githubUrl,
            linkedinUrl: formValues.linkedinUrl,
            twitterUrl: formValues.twitterUrl,
            portfolioUrl: formValues.portfolioUrl,
          }}
        />
      </div>
    </div>
  );
}
