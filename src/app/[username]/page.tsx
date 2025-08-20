export const dynamic = 'force-dynamic'; 

import { getUserProfile, getUniqueUsers, getUserCommunityDetailsById } from "@/lib/user";
import Link from "next/link";
import Image from "next/image";
import { notFound } from 'next/navigation';

import popHopLogo from "../../assets/pop-hop.svg";

import ShareButton from "@/components/user-interface/ShareButton";
import PhoneNumber from "@/components/user-interface/PhoneNumber";
import TabProfile from "@/components/user-interface/TabProfile";
import NewsletterForm from "@/components/form/NewsletterForm";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function Page(
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const profile = await getUserProfile(username)

  if (!profile) {
    notFound();
  }

  const rawCommunity = await getUserCommunityDetailsById(profile.id);

  const community = rawCommunity ?? {
    owned_communities:  [],
    member_communities: []
  };

  return (
    <section className="h-screen overflow-y-auto pb-16 bg-primary-foreground px-6 sm:px-0">
      <div className="flex flex-col items-center justify-start mx-auto max-w-150">
        <ShareButton />
        {profile.avatar && <Image src={profile.avatar} alt={`${profile.name} Avatar`} priority width={128} height={128} className="rounded-full object-cover" />}
        <h2 className="text-pf-name text-xl font-medium mt-6 flex items-center justify-center gap-2">
          <span>
            {profile.name}
          </span>
          {profile?.is_verified && verifiedIcon}
        </h2>
        <h2 className="my-2 text-pf-name text-base font-normal text-center">{profile.aboutUser}</h2>
        <div className="flex items-center justify-center gap-2 h-9 w-full">
          <Link href={`mailto:${profile.email}`} aria-label="Contact via email">
            {emailIcon}
          </Link>
          <PhoneNumber contactCountry={profile?.contactCountry} contactNumber={profile?.contactPhoneNumber} />
        </div>

        {profile.newsletter_subscription && (
          <Card className="w-full mt-5">
            <CardHeader>
              <CardTitle className="text-xl text-center">Join My Newsletter</CardTitle>
              <CardDescription className="text-center">Free or premium insights, delivered weekly.</CardDescription>
            </CardHeader>
            <CardContent>
              <NewsletterForm />
            </CardContent>
          </Card>
        )}

        {profile?.socialLinks?.length > 0 && (
          <TabProfile profile={profile} community={community} />
        )}

        <div className="mt-10 flex items-center justify-center">
          <Image src={popHopLogo} alt="Pophop Logo" priority className="h-10 w-31.5" />
        </div>
      </div>
    </section>
  );
}

export async function generateStaticParams() {
  const users = await getUniqueUsers();
  return users.map((user) => ({ username: user.name }));
}

const emailIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0 w-8 h-8"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.75 5.25L3 6V18L3.75 18.75H20.25L21 18V6L20.25 5.25H3.75ZM4.5 7.6955V17.25H19.5V7.69525L11.9999 14.5136L4.5 7.6955ZM18.3099 6.75H5.68986L11.9999 12.4864L18.3099 6.75Z"
        fill="#0a0a0a"
      />
    </g>
  </svg>
)

const verifiedIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#1877F2"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-badge-check-icon lucide-badge-check"
  >
    <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)